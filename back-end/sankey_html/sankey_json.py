import json
import os
import os.path


class sankey_txt(object):

	def __init__(self, file_dir):
		self.path = file_dir
		self.color = {"CNN": {'conv': ["rgba(54, 69, 133, 0.5)"],
		                      'MaxPool': ["rgba(90, 102, 158, 0.5)"],
		                      'AveragePool': ["rgba(163, 171, 206, 0.5)"]},
		              # rnn
		              "RNN":{'LSTM': ["rgba(212, 80, 135, 0.5)"],
		                     'GRU': ["rgba(249, 93, 106, 0.5)"]},
		              # other
		              "Other": {'input': ["rgba(255, 214, 203, 0.5)"],
		                        'dense': ["rgba(139, 60, 44, 0.5)"],
		                        'dropout': ["rgba(169, 98, 76, 0.5)"],
		                        'Flatten': ["rgba(198, 137, 112, 0.5)"],
		                        'optimizer': ["rgba(226, 176, 151, 0.5)"],
		                        'loss': ["rgba(109, 16, 16, 0.5)"]},
		              # activate function
		              "Activate": {'relu': ["rgba(255, 166, 1, 0.5)"],
		                           'sigmoid': ["rgba(255, 124, 1, 0.5)"],
		                           'softmax': ["rgba(255, 192, 1, 0.5)"]}
		              }
		self.node_color = {}  # 'con': "rgba(214, 39, 40, 0.8)"
		self.json_li = self.find_json()
		self.arg_li = []
		net_li = []
		for net in self.json_li:

			"""
			net_li = [['conv1d','maxpool','output'],
			          ['conv2d','maxpool','conv2d','output']]
			"""
			json_dic = self.json_reader(net)
			li, model_arg_li = self.generate_out_li(json_dic)
			self.arg_li.append(model_arg_li)
			net_li.append(li)

		node_dic, link_dic, node_args = self.generate_flow_txt(net_li)
		fig = self.genjson(node_dic, link_dic, node_args)
		json_path = os.path.join("/Users/mac/Desktop/R/backen/sankey/html/json_out", "output" + '.json')
		with open(json_path, 'w') as fp:
			json.dump(fig, fp)
			fp.close()

	def find_json(self):
		if (os.path.exists(self.path)):
			json_li = []
			for dirpath, dirnames, filenames in os.walk(self.path):
				for f in filenames:
					if os.path.splitext(f)[1] == '.json':
						json_li.append(os.path.join(dirpath, f))
			return json_li

	def json_reader(self, file):
		with open(file) as json_file:
			json_dic = json.load(json_file)
			json_file.close()
			return json_dic

	def generate_out_li(self, json_dic: dict):
		"""

		:param json_dic:
		:return: ['layer_type1',...]
		"""
		model_li = ["input"]  # a list of output for each model
		model_arg_li = [{"input": {}}]
		# TODO add hyperparameters here
		for layer in json_dic['layers'].keys():
			model_arg_dic = {}
			layer_type = json_dic['layers'][layer]['type']
			arg_dic = json_dic['layers'][layer]["args"]
			new_arg_dic = {}
			model_li.append(layer_type)
			act_li = []
			for arg_name in arg_dic.keys():
				tar = json_dic['layers'][layer]["args"][arg_name]
				if arg_name.find("activation") != -1:
					if isinstance(tar, str):
						if tar.find('relu') != -1:
							act = 'relu'
						elif tar.find('softmax') != -1:
							act = 'softmax'
						elif tar.find('sigmoid') != -1:
							act = 'sigmoid'
						model_li.append(act)
						act_li.append(act)
				else:
					if type(tar) in (float, int):
						new_arg_dic[arg_name] = tar
					elif isinstance(tar, list) and len(tar)==1 and type(tar[0]) in (float, int):
						new_arg_dic[arg_name] = tar[0]

			model_arg_dic[layer_type] = new_arg_dic
			model_arg_li.append(model_arg_dic)
			if act_li:
				for act in act_li:
					model_arg_li.append({act: {}})

		return model_li, model_arg_li

	def generate_tuple(self, li: list, out_li: list, txt_li: list, node_dic: dict):

		for j in range(len(li)):
			in_flow = li[j]
			if j == len(li) - 1:
				break
			out_flow = li[j + 1]
			for t, tx in zip(out_li, txt_li):
				if in_flow == t[0] and out_flow == t[1]:
					t[2] += 1
					tx[1] += 1
					continue
			s = str(in_flow) + ' -> ' + str(out_flow)
			out_li.append([node_dic[in_flow][0], node_dic[out_flow][0], 1, node_dic[out_flow][1], s])
			txt_li.append([in_flow, 1, out_flow])
		return out_li, txt_li

	def standardize(self, net_li: list):

		num_net = max([len(i) for i in net_li])
		count = {}
		match = {}  # "conv2d-1": ["input"]
		node = {}  # 'node_name": [id, color]
		node_id = 0
		for i in range(num_net):
			layer = []
			lay_arg_li = []
			for net, arg_li_ele in zip(net_li, self.arg_li):
				if len(net) - 1 >= i:
					layer.append(net[i])
					lay_arg_li.append(arg_li_ele[i])
				else:
					layer.append(" ")
					lay_arg_li.append(" ")
			new_li = []
			for j in range(len(layer)):
				ele = layer[j]
				if ele != " ":
					flag = 0
					if j != 0:
						for k in range(j):
							if ele == layer[k]:
								finded = new_li[k]
								compare = match[finded]
								if net_li[j][:i] != compare:
									count[ele] += 1
									new = ele + '-' + str(count[ele])
									match[new] = net_li[j][:i]
								else:
									new = finded
								flag = 1
								break
						if flag == 1:

							new_li.append(new)

					if flag == 0:
						if ele in count.keys():
							count[ele] += 1
						else:
							count[ele] = 1
						new = ele + '-' + str(count[ele])
						new_li.append(new)
						match[new] = net_li[j][:i]

					if len(net_li[j]) > i:
						net_li[j][i] = new
					assert len(list(self.arg_li[j][i].keys())) == 1
					old_key = list(self.arg_li[j][i].keys())[0]
					self.arg_li[j][i][net_li[j][i]] = self.arg_li[j][i][old_key]
					self.arg_li[j][i].pop(old_key)

					# node_color
					nc = ''
					color_flag = 0
					for out_type in self.color.keys():
						if color_flag == 1:
							break
						for type in self.color[out_type].keys():
							if ele.find(type) != -1 and type not in self.node_color.keys():
								self.node_color[type] = self.color[out_type][type][0]
								nc = self.node_color[type]
								color_flag = 1
								break
							elif ele.find(type) != -1 and type in self.node_color.keys():
								nc = self.node_color[type]
								color_flag = 1
								break

					if not nc:
						raise TypeError("find a new element not in self.color.keys()", ele)
					if new_li[j] not in node.keys():
						node[new_li[j]] = [node_id, nc]
						node_id += 1
				else:
					new_li.append(" ")
		return net_li, node

	def generate_args(self, node_label: dict):
		for key in node_label.keys():
			key_arg_dic = {}
			for i in self.arg_li:
				for j in i:
					if list(j.keys())[0] == key and j[key]:
						for k in j[key].keys():
							if k not in key_arg_dic.keys():
								key_arg_dic[k] = [j[key][k]]
							else:
								key_arg_dic[k].append(j[key][k])
			node_label[key].append(key_arg_dic)
		return node_label

	def generate_node(self, node_dic: dict):
		out_dic = {"label": [], "color": []}
		for key in node_dic.keys():
			label = key
			color = node_dic[label][1]
			out_dic["label"].append(label)
			out_dic["color"].append(color)
		return out_dic

	def genjson(self, node_dic, link_dic, node_args):
		# creating the sankey diagram
		node_li = []
		for i in range(len(node_dic['label'])):
			name = node_dic['label'][i]
			nc = ''
			t = ''
			cat = ''
			for out_type in self.color.keys():
				for type in self.color[out_type].keys():
					if name.find(type) != -1:
						nc = self.color[out_type][type][0]
						cat = type
						t = out_type
						break
			node_li.append(dict(
				name=name,
				color=nc,
				category=cat,
				type=t,
				args=node_args[name][2]
			))
		link_li = []
		n = len(link_dic['source'])
		for j in range(n):
			link_li.append(dict(
				source=link_dic['source'][j],
				value=link_dic['value'][j],
				target=link_dic['target'][j],
				color=link_dic['color'][j],
				label=link_dic['label'][j]
			))
		data = dict(
			nodes=node_li,
			links=link_li
			)
		return data

	def generate_flow_txt(self, net_li: list):
		"""

		:param net_li: net_li = [['conv1d','maxpool','output'],
			          ['conv2d','maxpool','conv2d','output']]
		:param net_name:
		:return:
		"""
		net_li, node_label = self.standardize(net_li)
		node_args = self.generate_args(node_label)
		node_dic = self.generate_node(node_label)

		tuple_li = []
		txt_li = []
		link_dic = {"source": [], "target": [], "value": [], "color": [], "label": []}
		for li in net_li:
			tuple_li, txt_li = self.generate_tuple(li, tuple_li, txt_li, node_label)

		for t, tx in zip(tuple_li, txt_li):
			link_dic["source"].append(t[0])
			link_dic["target"].append(t[1])
			link_dic["value"].append(t[2])
			link_dic["color"].append(t[3])
			link_dic["label"].append(t[4])

		return node_dic, link_dic, node_args


if __name__ == "__main__":
	json_li = sankey_txt('/Users/mac/Desktop/R/backen/sankey/json_folder')
