from ast import parse
from ast2json import ast2json
from traverse import traverse_py
import json


class traverse_dic():

	def __init__(self, path, paras, exist_json):

		self.path = path
		self.paras = paras
		self.exist_json = exist_json
		self.import_dic = {}
		self.import_function = {}
		self.import_packages = []
		self.function_args = {}
		self.class_name = {}  # {"class_1": ['func_1", ...]}
		self.class_def = {}  # {'class_name': {'func': '__init__', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}}
		self.func_def = {}  # {"func_name": {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}}
		"""
        "body": [
            {'func': 'tf.nn.conv2d', 
            'args': {}, 
            'layer': 'conv2d', 
            'body': [], 
            'lineno': 23}
        ]
        """
		self.class_var_dic = {}  # for the var that call the class
		self.def_func_rely = {}  # {'def_1': ['def_2'], 'def_2': []}
		self.net_type = {'type': {
			'cnn': {'tf.nn.conv2d': {'layer': 'Convolution', 'args': ['inputs', 'filters', 'strides', 'padding']},
			        'tf.layers.conv1d': {'layer': 'Convolution',
			                             'args': ['inputs', 'num_outputs', 'kernel_size', 'strides',
			                                      'padding']},
			        'tf.keras.layers.Conv1D': {'layer': 'Convolution', 'args': ['num_outputs', 'kernel_size']},
			        'tf.keras.layers.Conv2D': {'layer': 'Convolution', 'args': ['filters', 'kernel_size']},
			        'tf.layers.conv2d': {'layer': 'Convolution',
			                             'args': ['inputs', 'num_outputs', 'kernel_size', 'strides',
			                                      'padding']},
			        'tf.contrib.slim.conv2d': {'layer': 'Convolution',
			                                   'args': ['inputs', 'num_outputs', 'kernel_size']},
			        'tf.nn.conv2d_transpose': {'layer': 'Deconvolution',
			                                   'args': ['input', 'filters', 'output_shape', 'strides']},
			        'tf.keras.layers.Deconvolution3D': {'layer': 'Deconvolution', 'args': ['filters', 'kernel_size']},
			        'tf.keras.layers.Conv3D': {'layer': 'Convolution', 'args': ['filters', 'kernel_size']},
			        'tf.keras.layers.GlobalMaxPooling1D': {'layer': 'Max Pooling', 'args': []},
			        'tf.keras.layers.MaxPool2D': {'layer': 'Max Pooling',
			                                      'args': ['pool_size', 'strides', 'padding']},
			        'tf.contrib.slim.max_pool2d': {'layer': 'Max Pooling',
			                                       'args': ['inputs', 'pool_size']},
			        'tf.layers.max_pooling2d': {'layer': 'Max Pooling',
			                                    'args': ['inputs', 'pool_size', 'strides']},
			        'tf.nn.max_pool': {'layer': 'Max Pooling',
			                           'args': ['input', 'pool_size', 'strides', 'padding']},
			        'tf.keras.layers.MaxPooling3D': {'layer': 'Max Pooling',
			                                      'args': ['pool_size', 'strides', 'padding']},
			        'tf.layers.average_pooling2d': {'layer': 'Average Pooling',
			                                        'args': ['input', 'pool_size',
			                                                 'strides']},
			        'tf.keras.layers.GlobalAveragePooling1D': {'layer': 'Max Pooling', 'args': []}
			        },
			'dense': {'tf.layers.dense': {'layer': 'Dense', 'args': ['inputs', 'units']},
			          'tf.keras.layers.Dense': {'layer': 'Dense', 'args': ['inputs', 'units']},
			          'tf.contrib.slim.fully_connected': {'layer': 'Dense', 'args': ['inputs', 'num_outputs']},
			          },
			'flatten': {'tf.contrib.slim.flatten': {'layer': 'Flatten',
			                                        'args': ['inputs']},
			            'tf.keras.layers.Flatten': {'layer': 'Flatten',
			                                        'args': ['inputs']}
			            },
			'rnn': {'tf.nn.bidirectional_dynamic_rnn': {'layer': 'BiRNN', 'args': []},
			        'tf.keras.layers.Bidirectional': {'layer': 'BiRNN', 'args': ['layer']},
			        "tf.nn.dynamic_rnn": {'layer': 'RNN', 'args': ['cell', 'inputs']},
			        'tf.contrib.rnn.MultiRNNCell': {'layer': 'RNN', 'args': ['cells', 'inputs']}
			        },
			'lstm': {'tf.contrib.rnn.BasicLSTMCell': {'layer': 'LSTM', 'args': ['num_units']},
			         'tf.contrib.rnn.LSTMCell': {'layer': 'LSTM', 'args': ['num_units']},
			         'tf.keras.layers.LSTM': {'layer': 'LSTM', 'args': ['num_units']}
			         },
            'gru': {'tf.contrib.rnn.GRUCell': {'layer': 'GRU', 'args': ['num_units']},
                    'tf.keras.layers.GRU': {'layer': 'GRU', 'args': ['num_units']}
            },
			'crf': {'tf.contrib.crf.crf_log_likelihood': {'layer': 'CRF', 'args': ['inputs','tag_indices','sequence_lengths']}},
			'embedding': {"tf.nn.embedding_lookup": {'layer': 'Embedding', 'args':['params', 'ids']}}
		},
			# cnn
			# rnn
			'act_func': {'relu': {'tf.nn.relu': {'layer': 'ReLu', 'args': ['features']},
			                      'tf.keras.activations.relu': {'layer': 'ReLu', 'args': ['x']},
			                      'tf.keras.layers.ReLU': {'layer': 'ReLu', 'args': []}
			                      },
			             'softmax': {'tf.nn.softmax': {'layer': 'Softmax', 'args': ['logits']}
			                         },
			             'sigmoid': {'tf.nn.sigmoid': {'layer': 'Sigmoid', 'args': ['x']}}

			             },
			# activation function
			'loss': {'cross entropy': {
				'tf.nn.softmax_cross_entropy_with_logits': {'layer': 'Cross Entropy', 'args': []},
				'tf.nn.sigmoid_cross_entropy_with_logits': {'layer': 'Cross Entropy', 'args': []},
				'tf.nn.sparse_softmax_cross_entropy_with_logits': {'layer': 'Cross Entropy', 'args': []},
				'tf.keras.losses.categorical_crossentropy': {'layer': 'Cross Entropy', 'args': []}
				},
				'ctc': {
					"tf.nn.ctc_loss": {'layer': 'CTC', 'args': ['labels', 'logits', 'label_length', 'logit_length']}
				},
				'l2': {
					"tf.nn.l2_loss": {'layer': 'L2', 'args': ['t']}
				},
				'MSE': {
					'tf.keras.losses.MSE': {'layer': 'MSE', 'args': []}
				}
			},
			'tricks': {'attention': {'tf.keras.layers.Attention': {'layer': 'Attention', 'args': []}
			                         },
			           'dropout': {'tf.nn.dropout': {'layer': 'Dropout', 'args': ['x', 'rate']},
			                       'tf.keras.layers.Dropout': {'layer': 'Dropout', 'args': ['rate']},
			                       'tf.compat.v1.nn.dropout': {'layer': 'Dropout', 'args': ['x']},
			                       'tf.contrib.layers.dropout': {'layer': 'Dropout', 'args': ['inputs']},
			                       'tf.contrib.rnn.DropoutWrapper': {'layer': 'Dropout', 'args': ['cell']}
			                       },
			           'optimizer': {'tf.train.AdamOptimizer': {'layer': 'Optimizer', 'args': []},
			                         'tf.keras.optimizers.Adam': {'layer': 'Optimizer', 'args': []},
			                         'tf.keras.optimizers.Adadelta': {'layer': 'Optimizer', 'args': []}
			                         },
			           "normalization": {"tf.nn.batch_normalization": {'layer': 'Normalization', 'args': ['x']},
			                             "tf.contrib.layers.batch_norm": {'layer': 'Normalization', 'args': ['inputs']}}
			           }
		}
		self.parameters = {'lr': 'learning rate',
		                   'learning_rate': 'learning rate',
		                   'LEARNING_RATE': 'learning rate',
		                   'batch': 'batch size',
		                   'batch_size': 'batch size',
                           'BATCH_SIZE': 'batch size',
		                   'epochs': 'epochs',
		                   'epoch': 'epochs',
		                   'EPOCHS': 'epochs',
		                   'num_epochs': 'epochs',
                           'DROPOUT_RATE': 'dropout rate',
		                   'keep_prob': 'dropout rate',
		                   'decay_rate': 'decay rate',
		                   'decay': 'decay rate',
		                   'LR_DECAY_RATE': 'decay rate',
		                   'DECAY_RATE': 'decay rate',
		                   "momentum": 'momentum',
		                   'MOMENTUM': 'momentum'}
		self.net_li = []
		for cat in self.net_type.keys():
			for type in self.net_type[cat]:
				self.net_li += list(self.net_type[cat][type].keys())
		# TODO add more
		self.layers = {}
		self.tricks = []
		self.hyperparameters = {}
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
		"""
        using the target functions to fill in the defined functions
        :param body:
        :param safe_func:
        :param target_li:
        :return:
        """
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
			# safe_func is the function only contains target functions
			# or the including def functions have been transform to target functions.
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
									if i:
										new_body += i
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

	def build_rely(self, def_func, body, net_li, def_li):
		"""
        build self.def_func_rely
        :param def_func:
        :param body:
        :param net_li:
        :param def_li:
        :return:
        """

		new_body = []
		if isinstance(body, list):
			# if structure will generate a list body
			for b in body:
				if isinstance(b, list):
					new_body.append(self.build_rely(def_func, b, net_li, def_li))
				else:
					# body: {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}
					try:
						if b:
							if b['func'] in net_li:
								new_body.append(b)
							elif b['func'] in def_li:
								new_body.append(b)
								if b['func'] not in self.def_func_rely[def_func]:
									self.def_func_rely[def_func].append(b['func'])
							else:
								pass
					except TypeError:
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
		for cl in self.class_def.keys():
			for func in self.class_def[cl]['functions'].keys():
				def_li.append(self.class_def[cl]['functions'][func]['func'])
		for def_func in self.func_def.keys():
			self.def_func_rely[def_func] = []

			# self.func_def[def_func]: {'func': 'func_name', 'args': {}, 'layer': '', 'body': [], 'lineno': 23}
			body = self.func_def[def_func]['body']
			self.func_def[def_func]['body'] = self.build_rely(def_func, body, net_li, def_li)

		for cl in self.class_def.keys():
			tar_cl = self.class_def[cl]['functions']
			for func in tar_cl.keys():
				self.def_func_rely[func] = []
				# traverse every def functions inside the cl (class)
				body = tar_cl[func]['body']
				if body:
					self.class_def[cl]['functions'][func]['body'] = self.build_rely(func, body, net_li, def_li)

	def traverse_files(self):
		first_model = {}
		dir_list = traverse_py(self.path)
		dic_li = []
		for j in dir_list:
			dic_li.append(self.gener_json(j))

		i = 2
		for dic in dic_li:
			body_list = dic['body']
			for body in body_list:
				if body['_type'] == 'FunctionDef':
					self.traverse_function_def(body, None, i)
				elif body['_type'] == 'ClassDef':
					self.traverse_class_def(body, i)

		i = 1
		for dic in dic_li:
			body_list = dic['body']
			for body in body_list:
				if body['_type'] == 'FunctionDef':
					self.traverse_function_def(body, None, i)
				elif body['_type'] == 'ClassDef':
					self.traverse_class_def(body, i)  # inside the class, there are many def_funcs

		self.create_def_func_rely()
		self.traverse_safe_func()
		for dic in dic_li:
			self.traverse_module(dic)

		first_model["id"] = self.paras[0]
		first_model["Project_Name"] = self.paras[1]
		first_model["url"] = self.paras[2]
		first_model["file_name"] = self.paras[3]
		first_model["type"] = self.paras[4]
		first_model["hpyerparameters"] = self.hyperparameters
		first_model["num_layers"] = len(self.layers)
		first_model['layers'] = self.layers

		self.exist_json[first_model["id"]] = first_model

		return self.exist_json

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

	def traverse_attribute(self, func: dict, traverse_flag: list, var_dic, return_flag=False, class_var_dic=None):
		attr = func['attr']
		if func['value']['_type'] == 'Attribute':
			return self.traverse_attribute(func['value'], traverse_flag, var_dic, return_flag,
			                               class_var_dic) + '.' + attr
		elif func['value']['_type'] == 'Name':
			key = list(func['value'].keys())[3]
			id = func['value'][key]
			return id + '.' + attr
		elif func['value']['_type'] == 'Call':
			call = self.traverse_function_call(func['value'], traverse_flag, var_dic, return_flag, class_var_dic)
			if isinstance(call, dict):
				if 'func' in call:
					return call['func'] + '.' + attr

	def traverse_body(self, dic: dict, body_flag, traverse_flag, return_flag=False, var_dic=None, class_var_dic=None):
		"""

        :param return_flag:
        :param dic:
        :param function_body:
        :param traverse_flag: a list of [0, 'func_name']
        :param count:
        :return: function_body: [{'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}]
        """
		function_body = []
		if var_dic is None:
			var_dic = {}  # "{"var1": "value1", "var2": "value2"} and it will change frequently"
		if class_var_dic is None:
			class_var_dic = {}
		if dic[body_flag] is None:
			function_body.append({})
		else:
			for body in dic[body_flag]:
				if body['_type'] == 'FunctionDef':
					function_body.append(self.traverse_function_def(body, None, traverse_flag[0], return_flag))
				elif body['_type'] == 'Return':
					if body['value']['_type'] == 'Call':
						b = body['value']
						function_body.append(
							self.traverse_function_call(b, traverse_flag, var_dic, return_flag, class_var_dic))
					elif body['value']['_type'] == 'Tuple':
						for b in body['value']['elts']:
							if b['_type'] == 'Call':
								function_body.append(
									self.traverse_function_call(b, traverse_flag, var_dic, return_flag, class_var_dic))
				elif body['_type'] == 'Assign':
					result = self.traverse_assign(body, traverse_flag, var_dic, False, class_var_dic)
					# result = {"Call": {"var1 ":"value1"}, "var2": "value2"}
					for key in result.keys():
						if key == "Call":
							for call_key in result['Call'].keys():
								var_dic[call_key] = result['Call'][call_key]
								function_body.append(result['Call'][call_key])
							# {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
						elif key == "Class":
							for class_key in result['Class'].keys():
								class_var_dic[class_key] = result['Class'][class_key]
								init_name = result['Class'][class_key] + '.__init__'
								if init_name in self.class_def[result['Class'][class_key]]['functions'].keys():
									function_body.append(
										self.class_def[result['Class'][class_key]]['functions'][init_name])
						else:
							var_dic[key] = result[key]
				elif body['_type'] == 'Call':
					function_body.append(
						self.traverse_function_call(body, traverse_flag, var_dic, return_flag, class_var_dic))
				# {'func': 'func_name', 'args': [], 'layer': '', 'body': [], 'lineno': 23}
				elif body['_type'] == 'For':
					return_flag = True
					re = self.traverse_for(body, traverse_flag, var_dic, return_flag, class_var_dic)
					if not re:
						continue
					if isinstance(re, list):
						function_body += re
					elif isinstance(re, dict):
						function_body.append(re)
				elif body['_type'] == 'If':
					return_flag = True
					re = self.traverse_if(body, traverse_flag, var_dic, return_flag, class_var_dic)
					if not re:
						continue
					if isinstance(re, list):
						function_body += re
					elif isinstance(re, dict):
						function_body.append(re)
				# TODO: add traverse_while
				elif body['_type'] == 'With':
					function_body += self.traverse_with(body, body_flag, traverse_flag, var_dic, return_flag,
					                                    class_var_dic)
				elif body['_type'] == 'Expr':
					function_body.append(
						self.traverse_expr(body['value'], traverse_flag, var_dic, return_flag, class_var_dic))
				else:
					pass
			return function_body

	def traverse_function_def(self, dic: dict, class_name, traverse_flag: int, return_flag=False):
		"""

        :param return_flag:
        :param dic:
        :param traverse_flag: int, stand for the different time of traverse
        :param count:
        :return:
        """
		# TODO: find out how many layers it contains. And if it has, what are the args?
		func_name = dic['name']
		if class_name:
			func_name = class_name + '.' + func_name
		if traverse_flag == 2:
			return func_name
		elif traverse_flag == 1:
			# append every function into def_func['body']
			function_detail = {'func': func_name, 'args': [], 'layer': '', 'lineno': dic['lineno']}
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
				for i in range(0, len(default_value), -1):
					arg_dic[arg_name[i + x]] = default_value[i]
			function_detail["args"] = arg_dic
			function_detail['body'] = self.traverse_body(dic, 'body', [traverse_flag, class_name], return_flag)
			if return_flag == False:
				# to judge the function is in class or outside.
				self.func_def[func_name] = function_detail
			elif return_flag == True:
				return function_detail

		else:
			# TODO: at the other traverse, it will gradually append the target functions in other def functions to body.
			result = self.traverse_body(dic, 'body', [traverse_flag, func_name], return_flag)
			self.func_def[func_name]['body'].append(result)

	def traverse_class_def(self, dic, traverse_flag=0):
		"""
        self.class_def {"class_name": {"hyperparameters":{}, "functions":{}}}
        :param dic:
        :param traverse_flag:
        :return:
        """
		class_dic = {}
		func_dic = {}
		var_dic = {}
		if traverse_flag == 2:
			def_func_li = []
			for contain in dic['body']:
				if contain['_type'] == 'FunctionDef':
					func_name = self.traverse_function_def(contain, dic['name'], 2, True)
					def_func_li.append(func_name)
			self.class_name[dic['name']] = def_func_li

		elif traverse_flag == 1:
			for contain in dic['body']:
				if contain['_type'] == 'FunctionDef':
					function_detail = self.traverse_function_def(contain, dic['name'], 1, True)
					func_dic[dic['name'] + '.' + contain['name']] = function_detail
					self.func_def[dic['name'] + '.' + contain['name']] = function_detail
				elif contain['_type'] == 'Assign':
					result = self.traverse_assign(contain, traverse_flag, var_dic, False)
					# result = {"Call": {"var1 ":"value1"}, "var2": "value2"}
					for key in result.keys():
						if key != "Call" and key in self.parameters.keys():
							var_dic[key] = result[key]
			class_dic['functions'] = func_dic
			class_dic['hyperparameters'] = var_dic
			self.class_def[dic['name']] = class_dic

	def traverse_net(self, func_name: str, lineno: int, arg_kw_list: list, class_flag=None):
		"""
        decide whether a function is belong to our target function.
        :param func_name:
        :param lineno:
        :param arg_kw_list:
        :return: {'func': func_name, 'args': {}, 'layer': '', 'body': [], 'lineno': lineno}
        """
		func_detail_dic = {'func': func_name, 'args': {}, 'layer': '', 'body': [], 'lineno': lineno}
		if class_flag:
			pass
		for cat in self.net_type.keys():
			for type in self.net_type[cat].keys():
				for func_kw in self.net_type[cat][type]:
					if func_kw.find(func_name) != -1:
						func_detail_dic['body'] = []
						func_detail_dic['layer'] = self.net_type[cat][type][func_kw]['layer']
						# fill args:
						arg_kw_dic = {}
						for i in range(min(len(arg_kw_list[:-1]), len(self.net_type[cat][type][func_kw]['args']))):
							arg_name = self.net_type[cat][type][func_kw]['args'][i]

							if func_name == "tf.nn.conv2d" and arg_name == "filters":
								if isinstance(arg_kw_list[i], list) and len(arg_kw_list[i]) == 4:
									arg_kw_dic['num_output'] = arg_kw_list[i][3]
									arg_kw_dic['kernel_size'] = arg_kw_list[i][1]
							elif isinstance(arg_kw_list[i], int) or isinstance(arg_kw_list[i], float):
								arg_kw_dic[arg_name] = arg_kw_list[i]
							elif isinstance(arg_kw_list[i], list) and len(arg_kw_list[i]) == 1:
								arg_kw_dic[arg_name] = arg_kw_list[i][0]
							else:
								arg_kw_dic[arg_name] = ''
						arg_kw_dic.update(arg_kw_list[-1])

						func_detail_dic['args'] = arg_kw_dic
						return func_detail_dic, cat, type
		return func_detail_dic, '', ''

	def traverse_list(self, arg):
		if isinstance(arg, dict):
			arg = arg['elts']
		out_li = []
		for elt in arg:
			if elt['_type'] == 'Num':
				out_li.append(elt["n"])
		return out_li

	def traverse_function_call(self, dic: dict, traverse_flag: list, var_dic, return_flag=False, class_var_dic=None):
		"""
        if traverse == 0 and return_flag == False: append 'func_name' to self.layers
        :param dic:
        :param traverse_flag: [0, 'class_name']:
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
		func = dic['func']
		args = dic['args']
		keywords = dic['keywords']
		lineno = dic['lineno']
		arg_kw_list = []
		class_flag = None
		class_judge = None

		func_name = ''
		if func['_type'] == 'Name':
			func_name = func['id']
		elif func['_type'] == 'Attribute':
			func_name = self.traverse_attribute(func, traverse_flag, var_dic, return_flag, class_var_dic)
			if func_name and func_name.find("tf.") == -1:
				if traverse_flag[0] in [0, 1]:
					loop_target = class_var_dic.keys()
				else:
					loop_target = self.class_var_dic.keys()
				for pre_out in loop_target:
					if func_name.find(pre_out + '.') != -1:
						func_name = func_name.lstrip(pre_out + '.')
						func_name = class_var_dic[pre_out] + '.' + func_name
						class_flag = class_var_dic[pre_out]
				if func_name is None:
					return
				if traverse_flag[0] == 0:
					func_name = func_name.split(".")[-1]  # when doing match, we will not consider the attr
				elif func_name.find('self.') != -1:
					func_name = func_name.split('self.')[-1]
					if isinstance(traverse_flag[1], str):
						func_name = traverse_flag[1] + '.' + func_name
		if func_name is None:
			return
		elif traverse_flag[0] == 0 and func_name in self.class_name.keys():
			class_judge = func_name
			# if the function call is call of a class, then change the function call to class.__init__
			if (func_name + '.' + '__init__') in self.class_name[func_name]:
				func_name = func_name + '.' + '__init__'
			else:
				return class_judge

		for arg in args:
			if arg['_type'] == 'Call':
				arg_kw_list.append(self.traverse_function_call(arg, traverse_flag, var_dic, return_flag, class_var_dic))
			elif arg['_type'] == 'List':
				arg_kw_list.append(self.traverse_list(arg))
			elif arg['_type'] == 'Attribute':
				arg_kw_list.append(self.traverse_attribute(arg, traverse_flag, var_dic, return_flag, class_var_dic))
			elif arg["_type"] == 'ListComp':
				pass
			elif arg["_type"] == 'elts':
				pass
			else:
				try:
					key = list(arg.keys())[3]
					if arg[key] not in var_dic.keys():
						arg_kw_list.append(arg[key])
					else:
						arg_kw_list.append(var_dic[arg[key]])
				except TypeError:
					pass

		kw_dic = {}

		for kw in keywords:
			kw_name = kw['arg']
			if kw['value']['_type'] == 'Call':
				kw_dic[kw_name] = self.traverse_function_call(kw['value'], traverse_flag, var_dic, return_flag,
				                                              class_var_dic)
			elif kw['value']['_type'] == 'Attribute':
				kw_dic[kw_name] = self.traverse_attribute(kw['value'], traverse_flag, var_dic, return_flag,
				                                          class_var_dic)
			elif kw['value']['_type'] == 'List':
				kw_dic[kw_name] = self.traverse_list(kw['value'])
			else:
				try:
					key = list(kw['value'].keys())[3]
					if kw['value'][key] not in var_dic.keys():
						kw_dic[kw_name] = kw['value'][key]
					else:
						kw_dic[kw_name] = var_dic[kw['value'][key]]
				except TypeError:
					pass

		arg_kw_list.append(kw_dic)

		if traverse_flag[0] == 1:
			result, cat, type = self.traverse_net(func_name, lineno, arg_kw_list, class_flag)
			return result

		elif traverse_flag[0] == 0:

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
					if class_judge:
						# tell the assignment that this is a class
						return class_judge
					else:
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
									print("meet some trouble: %s is not in self.net_type." % (body['func']))
					if class_judge:
						# tell the assignment that this is a class
						return class_judge
					else:
						return

	def traverse_for(self, for_cell: dict, traverse_flag=None, var_dic=None, return_flag=True, class_var_dic=None):
		if class_var_dic is None:
			class_var_dic = {}
		if traverse_flag is None:
			traverse_flag = [0, '']
		if var_dic is None:
			var_dic = {}

		# TODO deal with for body
		body_li = []
		if 'body' in for_cell.keys():
			if for_cell['body']:
				result = self.traverse_body(for_cell, 'body', traverse_flag, return_flag, var_dic, class_var_dic)
				body_li += result

		# TODO deal with for range
		if for_cell['iter']['_type'] == 'Call' and 'id' in for_cell['iter']['func'].keys() and for_cell['iter']['func'][
			'id'] == 'range':
			range_li = []
			for arg in for_cell['iter']['args']:
				if arg["_type"] == 'Num':
					range_li.append(arg['n'])
				elif arg["_type"] == 'UnaryOp':
					range_li.append(-arg['operand']['n'])
			if range_li:
				iter_time = len(list(range(*range_li)))
				body_li = body_li * iter_time

		return body_li

	def traverse_if(self, if_cell: dict, traverse_flag=None, var_dic=None, return_flag=True, class_var_dic=None):
		"""

        :param if_cell:
        :param traverse_flag:
        :param var_dic:
        :param return_flag:
        :return:
        """
		# arguments that will not being used:
		if class_var_dic is None:
			class_var_dic = {}
		if traverse_flag is None:
			traverse_flag = [0, '']
		if var_dic is None:
			var_dic = {}

		body_li = []
		# all results list
		# TODO if body
		if 'body' in if_cell.keys():
			if if_cell['body']:
				body_li += self.traverse_body(if_cell, 'body', traverse_flag, return_flag, var_dic, class_var_dic)

		# TODO if orelse
		if 'orelse' in if_cell.keys():
			if if_cell['orelse']:
				body_li += self.traverse_body(if_cell, 'orelse', traverse_flag, return_flag, var_dic, class_var_dic)

		if traverse_flag[0] == 1:
			return body_li

	def traverse_parameters(self, assign_dic: dict):
		for i in assign_dic.keys():
			if 'Call' == i:
				for var in assign_dic['Call'].keys():
					if 'self.' in var:
						var = var.lstrip('self.')
					if var in self.parameters.keys():
						self.hyperparameters[self.parameters[var]] = assign_dic['Call'][var]
			elif 'Class' == i:
				for var in assign_dic['Class'].keys():
					if 'self.' in var:
						var = var.lstrip('self.')
					if var in self.parameters.keys():
						self.hyperparameters[self.parameters[var]] = assign_dic['Class'][var]
			else:
				if 'self.' in i:
					var = i.lstrip('self.')
				else:
					var = i
				if var in self.parameters.keys():
					self.hyperparameters[self.parameters[var]] = assign_dic[i]

	def traverse_assign(self, dic: dict, traverse_flag=None, var_dic=None, return_flag=False, class_var_dic=None):
		"""

        :param return_flag:
        :param target:
        :param value:
        :param lineno:
        :param traverse_flag: [0, 'def_func']
        :param count:
        :param var_dic:
        :return: assign_dic: {"Call": {"var1 ":"value1"}, "Class": {"var1 ":"value1"} "var2": "value2"}
        """
		if class_var_dic is None:
			class_var_dic = {}
		if traverse_flag is None:
			traverse_flag = [0, '']
		if var_dic is None:
			var_dic = {}
		target = dic['targets']
		value = dic['value']
		assign_dic = {}
		call_dic = {}
		class_dic = {}
		for tar in target:
			if tar['_type'] == 'Tuple':
				try:
					for var, val in zip(tar['elts'], value['elts']):
						if val['_type'] != 'Call':
							key = list(val.keys())[3]
							assign_dic[var['id']] = val[key]
						else:
							call = self.traverse_function_call(val, traverse_flag, var_dic, return_flag, class_var_dic)
							if isinstance(call, dict) and 'func' in call.keys():
								if call['func'] in self.class_name.keys():
									class_dic[var['id']] = call['func']
								else:
									call_dic[var['id']] = call
							elif isinstance(call, str):
								# traverse_flag[0] == 2 and means there is a call of class
								if call in self.class_name.keys():
									self.class_var_dic[var] = call
								else:
									print('Not normally get class name, please check:', call)
									continue
							else:
								continue
				except KeyError:
					for var in tar['elts']:
						if value['_type'] == 'Call':
							call = self.traverse_function_call(value, traverse_flag, var_dic,
							                                   return_flag, class_var_dic)

							if isinstance(call, dict) and 'func' in call.keys():
								if call['func'] in self.class_name.keys():
									class_dic[var['id']] = call['func']
								else:
									call_dic[var['id']] = call
							elif isinstance(call, str):
								# traverse_flag[0] == 2 and means there is a call of class
								if call in self.class_name.keys():
									self.class_var_dic[var] = call
								else:
									print('Not normally get class name, please check:', call)
									continue
							else:
								continue
						else:
							key = list(value.keys())[3]
							assign_dic[var['id']] = value[key]

			elif tar['_type'] == 'Name':
				if value['_type'] != 'Call':
					key = list(value.keys())[3]
					assign_dic[tar['id']] = value[key]
				else:
					call = self.traverse_function_call(value, traverse_flag, var_dic, return_flag, class_var_dic)

					if isinstance(call, dict) and 'func' in call.keys():
						if call['func'] in self.class_name.keys():
							class_dic[tar['id']] = call['func']
						else:
							call_dic[tar['id']] = call
					elif isinstance(call, str):
						# traverse_flag[0] == 2 and means there is a call of class
						if call in self.class_name.keys():
							self.class_var_dic[tar['id']] = call
						else:
							print('Not normally get class name, please check:', call)
							continue
					else:
						continue

			elif tar['_type'] == 'Attribute':
				tar_name = self.traverse_attribute(tar, traverse_flag, var_dic, return_flag, class_var_dic)
				if value['_type'] != 'Call':
					key = list(value.keys())[3]
					assign_dic[tar_name] = value[key]
				else:
					call = self.traverse_function_call(value, traverse_flag, var_dic, return_flag, class_var_dic)
					if isinstance(call, dict) and 'func' in call.keys():
						if call['func'] in self.class_name.keys():
							class_dic[tar_name] = call['func']
						else:
							call_dic[tar_name] = call

					elif isinstance(call, str):
						# traverse_flag[0] == 2 and means there is a call of class
						if isinstance(call, str) and call in self.class_name.keys():
							self.class_var_dic[tar_name] = call
						else:
							print('Not normally get class name, please check:', call)
							continue
					else:
						continue

		assign_dic['Call'] = call_dic
		assign_dic['Class'] = class_dic
		self.traverse_parameters(assign_dic)
		return assign_dic

	def traverse_expr(self, value: dict, traverse_flag=None, var_dic=None, return_flag=True, class_var_dic=None):
		if class_var_dic is None:
			class_var_dic = {}
		if traverse_flag is None:
			traverse_flag = [0, '']
		if var_dic is None:
			var_dic = {}

		func_contain = {}
		if value['_type'] == 'Call':
			func_contain = self.traverse_function_call(value, traverse_flag, var_dic, return_flag, class_var_dic)
		elif value['_type'] == 'Expr':
			func_contain = self.traverse_expr(value['value'], traverse_flag, var_dic, return_flag, class_var_dic)
		return func_contain

	def traverse_with(self, body: dict, body_flag, traverse_flag=None, var_dic=None, return_flag=True,
	                  class_var_dic=None):
		if class_var_dic is None:
			class_var_dic = {}
		if traverse_flag is None:
			traverse_flag = [0, '']
		if var_dic is None:
			var_dic = {}
		# dic: dict, function_body: list, traverse_flag, return_flag=False, var_dic=None
		with_body = self.traverse_body(body, body_flag, traverse_flag, return_flag, var_dic, class_var_dic)
		return with_body

	def traverse_module(self, dic: dict, traverse_flag=None, var_dic=None, return_flag=False, class_var_dic=None):
		# TODO used after traverse_functionDef and traverse_classDef. Find the entrance.
		if class_var_dic is None:
			class_var_dic = {}
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
				self.traverse_if(body, traverse_flag, var_dic, return_flag, class_var_dic)
			elif body['_type'] == 'For':
				self.traverse_for(body, traverse_flag, var_dic, return_flag, class_var_dic)
			elif body['_type'] == 'Assign':
				self.traverse_assign(body, traverse_flag, var_dic, return_flag, class_var_dic)
			elif body['_type'] == 'Expr':
				self.traverse_expr(body['value'], traverse_flag, var_dic, return_flag, class_var_dic)
