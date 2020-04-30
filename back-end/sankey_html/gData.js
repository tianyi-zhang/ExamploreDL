var genData = function(idList, path) {
	var colorDic = {
		"CNN": {
			'conv': "rgba(54, 69, 133, 0.5)",
			'MaxPool': "rgba(90, 102, 158, 0.5)",
			'AveragePool': "rgba(163, 171, 206, 0.5)"
		},
		"RNN":{
			'LSTM': "rgba(212, 80, 135, 0.5)",
			'GRU': "rgba(249, 93, 106, 0.5)",
			'Bi-RNN': "rgba(249, 93, 106, 0.5)"
		},
		"Other": {
			'input': "rgba(255, 214, 203, 0.5)",
			'dense': "rgba(139, 60, 44, 0.5)",
			'dropout': "rgba(169, 98, 76, 0.5)",
			'Flatten': "rgba(198, 137, 112, 0.5)",
			'optimizer': "rgba(226, 176, 151, 0.5)",
			'cross_entropy': "rgba(109, 16, 16, 0.5)",
			'attention': "rgba(109, 16, 16, 0.5)"
		},
		"Activate": {
			'relu': "rgba(255, 166, 1, 0.5)",
			'sigmoid': "rgba(255, 124, 1, 0.5)",
			'softmax': "rgba(255, 192, 1, 0.5)"
		}
	};
	var node_color = {};
	var json_path = path;
	var arg_li = [];
	var net_li = [];
	var max_length = 0;

	var generate_out_li = function(json_dic) {
		var model_li = ["input"];
		var model_arg_li = [{"input": {}}];
		for (const layer in json_dic['layers']) {
			var model_arg_dic = {};
			var layer_type = json_dic['layers'][layer]['type'];
			var arg_dic = json_dic['layers'][layer]["args"];
			var new_arg_dic = {};
			model_li.push(layer_type);
			var act_li = [];
			for (const arg_name in arg_dic) {
				var tar = json_dic['layers'][layer]["args"][arg_name];
				if ( arg_name.search("activation")!= -1) {
					if ((typeof tar) == "string") {
						if (tar.search('relu') != -1) {
							var act = 'relu';
						} else if (tar.search('softmax') != -1) {
							var act = 'softmax';
						} else if (tar.search('sigmoid') != -1) {
							var act = 'sigmoid';
						}
						model_li.push(act);
						act_li.push(act);
					} 
				} else {
					if ((typeof tar) == "number") {
						new_arg_dic[arg_name] = tar;
					} else if (Array.isArray(tar) && tar.length == 1 && (typeof tar[0]) == "number") {
						new_arg_dic[arg_name] = tar[0];
					}
				}
			}
			model_arg_dic[layer_type] = new_arg_dic;
			model_arg_li.push(model_arg_dic);
			if (act_li.length != 0) {
				for (var i=0; i<act_li.length; i++) {
					var keyDic = {};
					keyDic[act_li[i]] = {}
					model_arg_li.push(keyDic);
				}
			}
		}
		return [model_li, model_arg_li];
	}

	var compare_array = function(array1, array2) {
		return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
	}

	var get_num_net = function(net_li) {
		var li = [];
		for (var i=0; i<net_li.length; i++) {
			li.push(net_li[i].length);
		}
		return Math.max(...li);
	}

	var standardize = function(net_li, arg_li, colorDic) {
		var num_net = get_num_net(net_li);
		var count = {};
		var match = {}; 
		var node = {};  
		var node_id = 0;
		for (var i=0; i<num_net; i++) {
			var layer = [];
			var lay_arg_li = [];
			for (var j=0; j<arg_li.length; j++) {
				var net = net_li[j];
				var arg_li_ele = arg_li[j];
				if (net.length - 1 >= i) {
					layer.push(net[i]);
					lay_arg_li.push(arg_li_ele[i]);
				} else {
					layer.push(" ");
					lay_arg_li.push(" ");
				}
			}
			
			var new_li = [];
			for (var k=0; k<layer.length; k++) {
				var ele = layer[k];
				if (ele != " ") {
					var flag = 0;
					if (k != 0) {
						for (var l=0; l<k; l++) {
							if (ele == layer[l]) {
								var finded = new_li[l];
								var compare = match[finded];
								var need_compare = net_li[k].slice(0, i);
								if (compare_array(need_compare, compare)) {
									var new_ele = finded;
								} else {
									count[ele] += 1;
									var new_ele = ele + '-' + count[ele];
									match[new_ele] = need_compare;
								}
								flag = 1;
								break;
							}
						}
						if (flag == 1) {
							new_li.push(new_ele);
						}
					}
					if (flag == 0) {
						if (Object.keys(count).includes(ele)) {
							count[ele] += 1;
						} else {
							count[ele] = 1;
						}
						var new_ele = ele + '-' + count[ele];
						new_li.push(new_ele)
						match[new_ele] = net_li[k].slice(0, i);	
					}
					if (net_li[k].length > i) {
						net_li[k][i] = new_ele;
					}
					var old_key = Object.keys(arg_li[k][i])[0];
					arg_li[k][i][net_li[k][i]] = arg_li[k][i][old_key];
					delete arg_li[k][i][old_key];
					var nc = '';
					var color_flag = 0;
					for (const out_type in colorDic) {
						if (color_flag == 1) {
							break;
						}
						for (type in colorDic[out_type]) {
							if (ele.search(type) != -1) {
								if (Object.keys(node_color).includes(type)) {
									nc = node_color[type];
									color_flag = 1;
									break;
								} else {
									node_color[type] = colorDic[out_type][type];
									nc = node_color[type];
									color_flag = 1;
									break;
								}
							}
							
						}
					}
					if (nc == '') {
						throw "find a new element not in Object.keys(colorDic)" + ele;
					}
					if (!(Object.keys(node).includes(new_li[k]))) {
						
						node[new_li[k]] = [node_id, nc];
						node_id += 1;
					}
				} else {
					new_li.push(" ");
				}
						
			}
		}
		
		return [net_li, node, arg_li];
	}

	var generate_args = function(node_label, arg_li) {
		for (const key in node_label) {
			var key_arg_dic = {};
			for (var i=0; i<arg_li.length; i++) {
				for (var j=0; j<arg_li[i].length; j++) {		
					if (Object.keys(arg_li[i][j])[0] == key && arg_li[i][j][key] != {}) { 
						for (const k in arg_li[i][j][key]) {
							if (!(Object.keys(key_arg_dic).includes(k))) {
								key_arg_dic[k] = [arg_li[i][j][key][k]];
							} else {
								key_arg_dic[k].push(arg_li[i][j][key][k])
							}
						}
					}
				}
			}
			node_label[key].push(key_arg_dic);
		}
		return node_label;
	}

	var generate_node = function(node_dic) {
		
		var out_dic = {"label": [], "color": []};
		for (const key in node_dic) {
			var label = key;
			var color = node_dic[label][1];
			out_dic["label"].push(label);
			out_dic["color"].push(color);
		}
		return out_dic;
	}

	var generate_tuple = function(li, out_li, txt_li, node_dic) {
		for (var j=0; j<li.length; j++) {
			var in_flow = li[j];
			if (j == li.length - 1) {
				break;
			}
			var out_flow = li[j + 1];
			for (var k=0; k<out_li.length; k++) {
				var t = out_li[k];
				var tx = txt_li[k];
				if (in_flow == t[0] && out_flow == t[1]) {
					t[2] += 1;
					tx[1] += 1;
					continue;
				}
			}
			var s = in_flow + ' -> ' + out_flow;

			out_li.push([node_dic[in_flow][0], node_dic[out_flow][0], 1, node_dic[out_flow][1], s]);
			txt_li.push([in_flow, 1, out_flow]);
		}
		return [out_li, txt_li];
	}

	var generate_flow_txt = function(net_li, arg_li, colorDic) {
		var [new_net_li, node_label, arg_li] = standardize(net_li, arg_li, colorDic);
		var node_args = generate_args(node_label, arg_li);
		var node_dic = generate_node(node_label);
		var tuple_li = [];
		var txt_li = [];
		var link_dic = {"source": [], "target": [], "value": [], "color": [], "label": []};

		for (var i=0; i<net_li.length; i++) {
			var li = net_li[i];
			[tuple_li, txt_li] = generate_tuple(li, tuple_li, txt_li, node_label);
		}
		
		for (var j=0; j<tuple_li.length; j++) {
			var t = tuple_li[j];
			var tx = txt_li[j];
			link_dic["source"].push(t[0]);
			link_dic["target"].push(t[1]);
			link_dic["value"].push(t[2]);
			link_dic["color"].push(t[3]);
			link_dic["label"].push(t[4]);
		}	
		return [node_dic, link_dic, node_args];
	}

	var genjson = function(node_dic, link_dic, node_args, colorDic) {
		var node_li = [];
		for (var i=0; i<node_dic['label'].length; i++) {
			var name = node_dic['label'][i];
			var nc = '';
			var t = '';
			var cat = '';
			for (const out_type in colorDic) {
				for (const type in colorDic[out_type]) {
					if (name.search(type) != -1) {
						nc = colorDic[out_type][type];
						cat = type;
						t = out_type;
						break;
					}
				}
			}
			node_li.push({
				"name": name,
				"color": nc,
				"category": cat,
				"type": t,
				"args":node_args[name][2]
			});
		}
		var link_li = [];
		var n = link_dic['source'].length;
		for (var j=0; j<n; j++) {
			link_li.push({
				"source": link_dic['source'][j],
				"value": link_dic['value'][j],
				"target": link_dic['target'][j],
				"color": link_dic['color'][j],
				"label": link_dic['label'][j]
			});
		}
		var data_dic = {
			"nodes":node_li,
			"links":link_li
		}			
		return data_dic;		
	}
		
	var resultOut = fetch(json_path)
		.then(response => response.json())
		.then(function(jsonResponse) {
			var json_dic=jsonResponse;
			for (const i in json_dic) {
				if (idList.includes(i) && json_dic[i]['num_layers'] < 500) {
					var [li, model_arg_li] = generate_out_li(json_dic[i]);
					arg_li.push(model_arg_li);
					net_li.push(li);
					if (max_length<json_dic[i]['num_layers']) {
						max_length = json_dic[i]['num_layers'];
					}
				}
				
			}
					
		})
		.then(function() {
			genLayerChart(net_li);
			
			var [node_dic, link_dic, node_args] = generate_flow_txt(net_li, arg_li, colorDic);
			var proj = genjson(node_dic, link_dic, node_args, colorDic);
			genTypeChart(net_li, colorDic, proj);
			return [proj,max_length];
		}) 
	return resultOut;
}
