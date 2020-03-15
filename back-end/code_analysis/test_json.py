from ast import parse
from ast2json import ast2json
from traverse import traverse_py
import json

class traverse_dic():

    def __init__(self,path):
        self.path = path
        self.import_dic = {}
        self.import_function = []
        self.import_packages = []
        self.function_args = {}
        self.func_def = {} # {"func_name": {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}}
        """
        "body": [
            {'func': 'tf.nn.conv2d', 
            'args': {}, 
            'layer': 'conv2d', 
            'body': [], 
            'lineno': 23}
        ]
        """
        self.def_func_rely = {} # {'def_1': ['def_2'], 'def_2': []}
        self.net_type = {'type': {'cnn':{'tf.nn.conv2d': {'layer': 'conv2d', 'args': ['input', 'filters', 'strides', 'padding']},
                         'tf.keras.layers.MaxPool2D': {'layer': 'maxpool', 'args': ['pool_size', 'strides', 'padding']},
                         'tf.nn.max_pool': {'layer': 'maxpool', 'args': ['input', 'ksize', 'strides', 'padding']}}
                         # cnn
                         # rnn
                                  },
                         'act_func': {'relu': {'tf.nn.relu': {'layer': 'relu', 'args': ['features']},
                         'tf.keras.activations.relu': {'layer': 'relu', 'args': ['x']},
                         'tf.keras.layers.ReLU': {'layer': 'relu', 'args': []}
                                               }
                                      } ,
                         # activation function
                         'tricks': {'attention': {'tf.keras.layers.Attention': {'layer': 'attention', 'args': []}},
                         # attention
                         'dropout': {'tf.nn.dropout': {'layer': 'dropout', 'args': ['x', 'rate']},
                         'tf.keras.layers.Dropout': {'layer': 'dropout', 'args': ['rate']},
                         'tf.compat.v1.nn.dropout': {'layer': 'dropout', 'args': ['x']}}
                         # dropout
                              }
                         }
        self.net_li = []
        for cat in self.net_type.keys():
            for type in self.net_type[cat]:
                self.net_li += list(self.net_type[cat][type].keys())
        # TODO add more
        self.models = {}
        self.layers = {}
        self.tricks = []
        self.type = []
        """
        "layer_1": {
          "type": "CNN",
          "func": "tf.nn.layers.conv2d",
          "args": {
            "channels": 3,
            "strides": 2,
            "num_kernels": 40
          },
          "begin": "~/Desktop/R/cnn/cnn.py, line: 28",
          "end": "~/Desktop/R/cnn/cnn.py, line: 28"
        }
        """

    def gener_json(self, dir):
        ast = ast2json(parse(open(dir).read()))
        json_object = json.dumps(ast, indent=4)

        with open("output.json", "w") as outfile:
            outfile.write(json_object)
            outfile.close()

        with open('output.json') as json_file:
            ast_dic = json.load(json_file)
            json_file.close()

        return ast_dic

    def fill(self, body, safe_func, target_li):
        new_body = []
        for i in body:
            if isinstance(i, list):
                li_body = []
                for j in i:
                    if isinstance(j, list):
                        li_body.append(self.fill(j, safe_func, target_li))
                new_body.append(li_body)
            else:
                if i['func'] == safe_func:
                    new_body += target_li
                else:
                    new_body.append(i)
        return new_body

    def traverse_safe_func(self):
        if self.def_func_rely.keys():
        # safe_func is the function only contains target functions or the including def functions have been transform to target functions.
            safe_func_li = []
            # get the def functions which will not call other def functions.
            for def_func in self.def_func_rely.keys():
                if not self.def_func_rely[def_func]:
                    safe_func_li.append(def_func)
            # replace the including safe_func with target functions inside the safe_func.
            for safe_func in safe_func_li:
                # get the target functions list of safe functions:
                target_li = self.func_def[safe_func]['body']
                for func in self.def_func_rely.keys():
                    if safe_func in self.def_func_rely[func]:
                        # func: {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}
                        body = self.func_def[func]['body']
                        new_body = self.fill(body, safe_func, target_li)
                        self.func_def[func]['body'] = new_body
                        self.def_func_rely[func].remove(safe_func)
                        if len(self.def_func_rely[func]) == 0:
                            new_body = []
                            for i in self.func_def[func]['body']:
                                if isinstance(i, list):
                                    layer_num_li, layer_type_li = self.judge(i)
                                    new_body += i[layer_num_li.index(max(layer_num_li))]
                                else:
                                    if i['func'] == safe_func:
                                        new_body += target_li
                                    else:
                                        new_body.append(i)
                            self.func_def[func]['body'] = new_body

            # delete the safe functions from self.def_func_rely.
            for safe_func in safe_func_li:
                self.def_func_rely.pop(safe_func)
            self.traverse_safe_func()
        else:
            return

    def traverse_if_body(self, def_func, body, net_li, def_li):
        new_body = []
        if isinstance(body, list):
            # if structure will generate a list body
            for b in body:
                if isinstance(b, list):
                    new_body.append(self.traverse_if_body(def_func, b, net_li, def_li))
                else:
                    # body: {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}
                    if b['func'] in net_li:
                        new_body.append(b)
                    elif b['func'] in def_li:
                        new_body.append(b)
                        if b['func'] not in self.def_func_rely[def_func]:
                            self.def_func_rely[def_func].append(b['func'])
                    else:
                        pass
        return new_body

    def create_def_func_rely(self):
        """
        drop function inside the def_func which is not belong to target function or def_func
        create self.def_func_rely: ['def_func1':[], 'def_func2':['def_func1']]
        :return:
        """
        net_li = self.net_li
        def_li = list(self.func_def.keys())
        for def_func in self.func_def.keys():
            self.def_func_rely[def_func] = []

            # self.func_def[def_func]: {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}
            body = self.func_def[def_func]['body']
            self.func_def[def_func]['body'] = self.traverse_if_body(def_func, body, net_li, def_li)

    def traverse_files(self):
        self.models = {"num_models": 1, "1": {}}
        model_li = []
        first_model = {}
        dir_list = traverse_py(self.path)
        dic_li = []
        for j in dir_list:
            dic_li.append(self.gener_json(j))

        i = 1
        for dic in dic_li:
            body_list = dic['body']
            for body in body_list:
                if body['_type'] == 'FunctionDef':
                    self.traverse_function_def(body, i)
                elif body['_type'] == 'ClassDef':
                    self.traverse_class_def(body, i) # inside the class, there are many def_funcs
        self.create_def_func_rely()
        self.traverse_safe_func()
        for dic in dic_li:
            self.traverse_module(dic)

        first_model["type"] = self.type
        first_model["num_layers"] = len(self.layers)
        first_model['tricks'] = self.tricks
        first_model['layers'] = self.layers
        model_li.append(first_model)
        self.models['num_models'] = len(model_li)
        for i in range(1,len(model_li)+1):
            self.models[str(i)] = model_li[i-1]
        return self.models

    def get_num_layer(self, body: list):
        layer_num = 0
        layer_li = []
        for result in body:
            # get each result: j: {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
            if not result:
                continue
            elif result['layer'] == '' and result['body']:
                # means function is a def function and function contains the target functions
                num_layer, layer_type = self.get_num_layer(result['body'])
                layer_num += num_layer
                layer_li = layer_li + layer_type
            elif result['layer'] != '' and result['body'] == []:
                # process single target function
                layer_num += 1
                layer_li.append(result['layer'])
            else:
                continue
        return layer_num, layer_li

    def judge(self, ju_li: list):
        """
        judge which one contains most layers.
        :param ju_li: [[result1, result2],[result1]]
        :return:
        """
        layer_num_li = []
        layer_type_li = []
        for i in ju_li:
            # get components
            layer_num, layer_li = self.get_num_layer(i)
            layer_num_li.append(layer_num)
            layer_type_li.append(layer_li)
        return layer_num_li, layer_type_li

    def traverse_import(self, body: dict):
        target = body['names']
        for tar_dic in target:
            import_package_name = tar_dic['name']
            import_asname = tar_dic['asname']
            if import_package_name not in self.import_packages:
                self.import_packages.append(import_package_name)
            if import_asname not in self.import_dic.keys() and import_asname is not None:
                self.import_dic[import_asname] = import_package_name

    def traverse_import_from(self, body: dict):
        import_package_name = body['module']
        if import_package_name not in self.import_packages:
            self.import_packages.append(import_package_name)
        target = body['names']
        for tar_dic in target:
            import_function_name = tar_dic['name']
            if import_function_name != '*':
                if import_function_name not in self.import_dic.keys():
                    self.import_dic[import_function_name] = import_package_name
                if import_function_name not in self.import_function:
                    self.import_function[import_function_name] = 0

    def traverse_attribute(self, func: dict):
        attr = func['attr']
        if func['value']['_type'] != 'Attribute':
            key = list(func['value'].keys())[3]
            id = func['value'][key]
            return id+'.'+attr
        return self.traverse_attribute(func['value'])+'.'+attr

    def traverse_line(self, dic: dict, function_body: list, traverse_flag, return_flag=False):
        """

        :param return_flag:
        :param dic:
        :param function_body:
        :param traverse_flag: a list of [0, 'func_name']
        :param count:
        :return: function_body: [{'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}]
        """
        var_dic = {}  # "{"var1": "value1", "var2": "value2"} and it will change frequently"
        if dic['body'] is None:
            function_body.append({})
        else:
            for body in dic['body']:
                if body['_type'] == 'Assign':
                    result = self.traverse_assign(body, traverse_flag, var_dic, False)
                    # result = {"Call": {"var1 ":"value1"}, "var2": "value2"}
                    for key in result.keys():
                        if key != "Call":
                            var_dic[key] = result[key]
                        else:
                            for call_key in result['Call'].keys():
                                var_dic[call_key] = result['Call'][call_key]
                                function_body.append(result['Call'][call_key])
                                # {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
                elif body['_type'] == 'Call':
                    function_body.append(self.traverse_function_call(body, traverse_flag, var_dic, return_flag))
                    # {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
                elif body['_type'] == 'For':
                    function_body.append(self.traverse_for(body, traverse_flag, var_dic, return_flag))
                elif body['_type'] == 'If':
                    function_body.append(self.traverse_if(body, traverse_flag, var_dic, return_flag))
                # TODO: add traverse_while
                else:
                    pass
            return function_body

    def traverse_function_def(self, dic: dict, traverse_flag: int, return_flag=False):
        """

        :param return_flag:
        :param dic:
        :param traverse_flag: int, stand for the different time of traverse
        :param count:
        :return:
        """
        # TODO: find out how many layers it contains. And if it has, what are the args?
        func_name = dic['name']
        if func_name == '__init__':
            return
        if traverse_flag == 1:
            # append every function into def_func['body']
            function_detail = {'func': func_name, 'args': [], 'layer': '', 'lineno': dic['lineno']}
            function_body = []
            arg_name = []
            default_value = []
            arg_dic = {}
            if isinstance(dic['args'], list):
                args = dic['args']
                defaults = dic['defaults']
            else:
                args = dic['args']['args']
                defaults = dic['args']['defaults']
            for arg in args:
                arg_name.append(arg['arg'])
            for default in defaults:
                default_value.append(default)
            if default_value is not None:
                x = len(arg_name) - len(default_value)
                for i in range(0,len(default_value),-1):
                    arg_dic[arg_name[i+x]] = default_value[i]
            function_detail["args"] = arg_dic

            # TODO: traverse lines
            function_detail['body'] = self.traverse_line(dic, function_body, [traverse_flag, func_name], return_flag)
            self.func_def[func_name] = function_detail

        else:
            # TODO: at the other traverse, it will gradually append the target functions in other def functions to body.
            function_body = []  # should be a list
            result = self.traverse_line(dic, function_body, [traverse_flag, func_name], return_flag)
            self.func_def[func_name]['body'].append(result)

    def traverse_class_def(self, dic, traverse_flag=0):
        for contain_func_def in dic['body']:
            if contain_func_def['_type'] == 'FunctionDef':
                self.traverse_function_def(contain_func_def, traverse_flag)

    def traverse_net(self, func_name: str, lineno: int, arg_kw_list: list):
        """
        decide whether a function is belong to our target function.
        :param func_name:
        :param lineno:
        :param arg_kw_list:
        :return: {'func': func_name, 'args': {}, 'layer': '', 'body': [], 'lineno': lineno}
        """
        func_detail_dic = {'func': func_name, 'args': {}, 'layer': '', 'body': [], 'lineno': lineno}
        for cat in self.net_type.keys():
            for type in self.net_type[cat].keys():
                for func_kw in self.net_type[cat][type]:
                    if func_kw.find(func_name) != -1:
                        func_detail_dic['body'] = []
                        func_detail_dic['layer'] = self.net_type[cat][type][func_kw]['layer']
                        # fill args:
                        arg_kw_dic = {}
                        for i in range(min(len(arg_kw_list[:-1]), len(self.net_type[cat][type][func_kw]['args']))):
                            arg_kw_dic[self.net_type[cat][type][func_kw]['args'][i]] = arg_kw_list[i]
                        arg_kw_dic.update(arg_kw_list[-1])
                        func_detail_dic['args'] = arg_kw_dic
                        return func_detail_dic, cat, type
        return func_detail_dic, '', ''

    def traverse_list(self, arg):
        if isinstance(arg, dict):
            arg = arg['elts']
        for elt in arg:
            li = []
            if elt['_type'] == 'List':
                li.append(self.traverse_list(elt['elts']))
                return li
            else:
                key = list(elt.keys())[3]
                li.append(elt[key])
                return li

    def traverse_function_call(self, dic: dict, traverse_flag: list, var_dic, return_flag=False):
        """
        if traverse == 0 and return_flag == False: append 'func_name' to self.layers
        :param dic:
        :param traverse_flag: [0, 'def_func']: def_func: without attr
        :param count:
        :param var_dic:
        :param return_flag: if, for, while, else structures should be True
        :return: func_detail_dic: {'func': 'func_name',
                                    'args': {},
                                    'layer': '',
                                    'body': [{'func': 'func_name', 'args': [], 'layer': 'layer_type1', 'body': [], 'lineno': 23},{}],
                                    'lineno': 23},

                self.func_def[func_name]: {'func': 'func_name',
                                           'args': {},
                                           'layer': '',
                                           'body': [],
                                           'lineno': 23}
        """
        # TODO traverse_flag = [2, 'cnn_cell'], why self.func_def_rely still unchanged?
        func = dic['func']
        args = dic['args']
        keywords = dic['keywords']
        lineno = dic['lineno']
        arg_kw_list = []
        func_name = ''
        if func['_type'] == 'Name':
            func_name = func['id']
        elif func['_type'] == 'Attribute':
            func_name = self.traverse_attribute(func)
            if traverse_flag[0] == 0:
                func_name = func_name.split(".")[-1] # when doing match, we will not consider the attr
            elif func_name.find('self.') != -1:
                func_name = func_name.lstrip('self.')
        if func_name is None or func_name.find('__init__') != -1:
            return
        for arg in args:
            if arg['_type'] == 'Call':
                arg_kw_list.append(self.traverse_function_call(arg, traverse_flag, var_dic, return_flag))
            elif arg['_type'] == 'List':
                arg_kw_list.append(self.traverse_list(arg))
            else:
                key = list(arg.keys())[3]
                if arg[key] not in var_dic.keys():
                    arg_kw_list.append(arg[key])
                else:
                    arg_kw_list.append(var_dic[arg[key]])

        kw_dic = {}
        for kw in keywords:
            kw_name = kw['arg']
            if kw['value']['_type'] != 'Call':
                key = list(kw['value'].keys())[3]
                if kw['value'][key] not in var_dic.keys():
                    kw_dic[kw_name] = kw['value'][key]
                else:
                    kw_dic[kw_name] = var_dic[kw['value'][key]]
            else:
                kw_dic[kw_name] = self.traverse_function_call(kw['value'], traverse_flag, var_dic, return_flag)
        arg_kw_list.append(kw_dic)

        if traverse_flag[0] == 1:
            result, cat, type = self.traverse_net(func_name, lineno, arg_kw_list)
            return result

        else:
            # traverse_flag[0] == 0
            if return_flag:
                # find in the target functions.
                result, cat, type = self.traverse_net(func_name, lineno, arg_kw_list)
                # {'func': func_name, 'args': {}, 'layer': '', 'body': [], 'lineno': lineno}
                if result['layer']:
                    return result
                else:
                    # not the target function, find on def functions.
                    for func_def in self.func_def.keys():
                        if func_name == func_def:
                            return self.func_def[func_name]
            else:
                layer_dic = {}
                # add layers
                count = len(list(self.layers.keys()))
                layer_name = 'layer' + str(count)
                result, cat, type = self.traverse_net(func_name, lineno, arg_kw_list)
                # {'func': func_name, 'args': {}, 'layer': '', 'body': [], 'lineno': lineno}
                if result['layer']:
                    layer_dic['type'] = result['layer']
                    layer_dic['func'] = result['func']
                    layer_dic['args'] = result['args']
                    layer_dic['begin'] = result['lineno']
                    self.layers[layer_name] = layer_dic
                    if type:
                        if type not in self.type and cat not in ['tricks', 'act_func']:
                            self.type.append(type)
                        elif cat == 'tricks' and type not in self.tricks:
                            self.tricks.append(type)
                    return
                else:
                    for func_def in self.func_def.keys():
                        if func_name == func_def:
                            # {"func_name": {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}}
                            for body in self.func_def[func_name]['body']:
                                if not body:
                                    continue
                                layer_dic = {}
                                count = len(list(self.layers.keys()))
                                layer_name = 'layer' + str(count)
                                # each function in the body should be a target function:
                                # body: {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
                                if body['func'] in self.net_li:
                                    layer_dic['type'] = body['layer']
                                    layer_dic['func'] = body['func']
                                    layer_dic['args'] = body['args']
                                    layer_dic['begin'] = body['lineno']
                                    self.layers[layer_name] = layer_dic
                                else:
                                    print("meet some trouble: %s is not in self.net_type." %(body['func']))

    def traverse_for(self, for_cell: dict, traverse_flag=None, var_dic=None, return_flag=True):
        pass

    def traverse_cell(self, body_cell: list, traverse_flag, var_dic, return_flag):
        result_li = []
        for body in body_cell:
            if body['_type'] == 'For':
                result = self.traverse_for(body, traverse_flag, var_dic, return_flag)
                result_li.append(result)
            elif body['_type'] == 'If':
                result = self.traverse_if(body, traverse_flag, var_dic, return_flag)
                result_li.append(result)
            elif body['_type'] == 'Expr':
                result = self.traverse_expr(body, traverse_flag, var_dic, return_flag)
                result_li.append(result)
            elif body['_type'] == 'Assign':
                result = self.traverse_assign(body, traverse_flag, var_dic, return_flag)
                # result = {"Call": {"var1 ":"value1"}, "var2": "value2"}
                for key in result.keys():
                    if key == "Call":
                        for call_key in result['Call'].keys():
                            result = result['Call'][call_key]
                            result_li.append(result)
                            # {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
            else:
                result = {}
                result_li.append(result)
        return result_li

    def traverse_branch(self, branch: dict, traverse_flag, var_dic, return_flag):
        ju_li = []
        num_branch = 0
        ju_li.append(self.traverse_cell(branch['body'], traverse_flag, var_dic, return_flag))
        if 'orelse' in branch.keys() and branch['orelse']:
            next_branch = branch['orelse'][0]
            num_to, li = self.traverse_branch(next_branch, traverse_flag, var_dic, return_flag)
            ju_li += li
            num_branch += num_to
            return num_branch, ju_li
        else:
            return 1, ju_li

    def traverse_if(self, if_cell: dict, traverse_flag=None, var_dic=None, return_flag=True):
        """

        :param if_cell:
        :param traverse_flag:
        :param var_dic:
        :param return_flag:
        :return:
        """
        # arguments that will not being used:
        if traverse_flag is None:
            traverse_flag = [0, '']
        if var_dic is None:
            var_dic = {}

        # all results list
        num_branch, ju_li = self.traverse_branch(if_cell, traverse_flag, var_dic, return_flag)
        if traverse_flag[0] == 1:
            return ju_li
        layer_num_li, layer_type_li = self.judge(ju_li)
        best_branch = layer_num_li.index(max(layer_num_li))
        if best_branch == 0:
            self.traverse_cell(if_cell['body'], traverse_flag, var_dic, False)
        elif best_branch == num_branch:
            for i in range(best_branch-1):
                if_cell = if_cell['orelse'][0]
            self.traverse_cell(if_cell['orelse'], traverse_flag, var_dic, False)
        else:
            for i in range(best_branch):
                if_cell = if_cell['orelse'][0]
            self.traverse_cell(if_cell['body'], traverse_flag, var_dic, False)

    def traverse_assign(self, dic: dict, traverse_flag=None, var_dic=None, return_flag=False):
        """

        :param return_flag:
        :param target:
        :param value:
        :param lineno:
        :param traverse_flag: [0, 'def_func']
        :param count:
        :param var_dic:
        :return: assign_dic: {"Call": {"var1 ":"value1"}, "var2": "value2"}
        """
        if traverse_flag is None:
            traverse_flag = [0, '']
        if var_dic is None:
            var_dic = {}
        target = dic['targets']
        value = dic['value']
        assign_dic = {}
        call_dic = {}

        for tar in target:
            if tar['_type'] == 'Tuple':
                for var, val in zip(tar['elts'],value['elts']):
                    if val['_type'] != 'Call':
                        key = list(val.keys())[3]
                        assign_dic[var['id']] = val[key]
                    else:
                        call_dic[var['id']] = self.traverse_function_call(val, traverse_flag, var_dic, return_flag)
            elif tar['_type'] == 'Name':
                if value['_type'] != 'Call':
                    key = list(value.keys())[3]
                    assign_dic[tar['id']] = value[key]
                else:
                    call_dic[tar['id']] = self.traverse_function_call(value, traverse_flag, var_dic, return_flag)

        assign_dic['Call'] = call_dic
        return assign_dic

    def traverse_expr(self, value: dict, traverse_flag=None, var_dic=None, return_flag=True):
        if traverse_flag is None:
            traverse_flag = [0, '']
        if var_dic is None:
            var_dic = {}
        if value['_type'] == 'Call':
            self.traverse_function_call(value, traverse_flag, var_dic, return_flag)

    def traverse_module(self, dic: dict, traverse_flag=None, var_dic=None, return_flag=False):
        # TODO used after traverse_functionDef and traverse_classDef. Find the entrance.
        if traverse_flag is None:
            traverse_flag = [0, '']
        if var_dic is None:
            var_dic = {}
        body_list = dic['body']
        for body in body_list:
            if body['_type'] == 'Import':
                self.traverse_import(body)
            elif body['_type'] == 'ImportFrom':
                self.traverse_import_from(body)
            elif body['_type'] == 'If':
                self.traverse_if(body, traverse_flag, var_dic, True)
            elif body['_type'] == 'For':
                pass
                self.traverse_for(body, traverse_flag, var_dic, True)
            elif body['_type'] == 'Assign':
                self.traverse_assign(body, traverse_flag, var_dic, return_flag)
            elif body['_type'] == 'Expr':
                self.traverse_expr(body['value'], traverse_flag, var_dic, return_flag)