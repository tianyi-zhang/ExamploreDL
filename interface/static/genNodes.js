var allProNodes = [];
var genData = function(idList, path, viewName='oriView') {
	var typedic = {'C': "Convolution",
			'M': "Max Pooling",
			'A': "Average Pooling",
			'L': "LSTM",
			'G': "GRU",
			'B': "BiRNN",
			'I': "Input",
			'D': "Dense",
			'F': "Flatten",
			'P': "Dropout",
			'T': "Attention",
			'E': "Cross Entropy",
			'O': "Optimizer",					
			'R': "ReLu",
			'S': "Sigmoid",
			'X': "Softmax"};
	var colorDic = {
		"CNN": {
			'Convolution': "rgba(54, 69, 133, 0.65)",
			'Max Pooling': "rgba(90, 102, 158, 0.65)",
			'Average Pooling': "rgba(163, 171, 206, 0.65)"
		},
		"RNN":{
			'LSTM': "rgba(212, 80, 135, 0.65)",
			'GRU': "rgba(249, 93, 106, 0.65)",
			'BiRNN': "rgba(249, 93, 106, 0.65)"
		},
		"Other": {
			'Input': "rgba(76, 18, 1, 0.65)",
			'Dense': "rgba(176, 43, 2, 0.65)",
			'Flatten': "rgba(252, 81, 28, 0.65)",
			'Dropout': "rgba(18, 109, 52, 0.65)",
			'Attention': "rgba(152, 231, 49, 0.65)",
			'Cross Entropy': "rgba(65, 39, 89, 0.65)",
			'Optimizer': "rgba(91, 54, 125, 0.65)"					
		},
		"Activate": {
			'ReLu': "rgba(255, 166, 1, 0.65)",
			'Sigmoid': "rgba(255, 124, 1, 0.65)",
			'Softmax': "rgba(255, 192, 1, 0.65)"
		}
	};
	var node_color = {};
	var json_path = path;
	var arg_li = [];
	var net_li = [];
	var proNode = {};
	var hyper = {};
	var max_length = 0;
	var totalNum = 0;

	var generate_out_li = function(json_dic) {
		var model_li = ["Input"];
		var model_arg_li = [{"Input": {}}];
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
							var act = 'ReLu';
						} else if (tar.search('softmax') != -1) {
							var act = 'Softmax';
						} else if (tar.search('sigmoid') != -1) {
							var act = 'Sigmoid';
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
				if (net_li[j].length - 1 >= i) {
					layer.push(net_li[j][i]);
					lay_arg_li.push(arg_li[j][i]);
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
									new_li.push(new_ele);
									flag = 1;
									break;
								} 
							}
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
		var newDict = {};
		for (var l=0; l<node_label.length; l++) {
			var key = Object.keys(node_label[l])[0];
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
			node_label[l][key].push(key_arg_dic);
			newDict[key] = node_label[l][key];
		}
		return newDict;
	}

	var generate_node = function(node_dic) {
	
		var out_dic = {"label": [], "color": []};
		for (var i=0; i<node_dic.length; i++) {
			var label = Object.keys(node_dic[i])[0];
			var color = node_dic[i][label][1];
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
			for (var l=0; l<node_dic.length; l++) {
				if (in_flow in node_dic[l]) {
					var flowIn = node_dic[l][in_flow];
				} else if (out_flow in node_dic[l]) {
					var flowOut = node_dic[l][out_flow];
				}
			}
			out_li.push([flowIn[0], flowOut[0], 1, flowOut[1], s]);
			txt_li.push([in_flow, 1, out_flow]);
		}
		return [out_li, txt_li];
	}

	var generate_flow_txt = function(net_li, arg_li, colorDic) {
		
		var [new_net_li, node_label, arg_li] = standardize(net_li, arg_li, colorDic);
		var newNodeLabel = [];

		for (const myKey in node_label) {
			var newDict = {};
			newDict[myKey] = node_label[myKey];
			newNodeLabel.push(newDict);
		}

		for (var k=0; k<new_net_li.length; k++) {
			var middleLi = [];
			for (var l=0; l<new_net_li[k].length; l++) {
				if (new_net_li[k][l].includes("align")) {
					middleLi.push(l);
				} else {
					var changeName = new_net_li[k][l];
					for (var m=0; m<middleLi.length; m++) {
						//Convolution-align-1-1 & Convolution-19
						var oriName = new_net_li[k][middleLi[m]];
						new_net_li[k][middleLi[m]]=changeName+"-align-"+m;
						arg_li[k][middleLi[m]]=changeName+"-align-"+m;
						for (var n=0; n<newNodeLabel.length; n++) {
							if (oriName in newNodeLabel[n]) {
								newNodeLabel[n] = {};
								newNodeLabel[n][changeName+"-align-"+m] = node_label[oriName];
							}
						}
					}
					middleLi = [];
				}
			}
		}

		var node_args = generate_args(newNodeLabel, arg_li);
		var node_dic = generate_node(newNodeLabel);
		var tuple_li = [];
		var txt_li = [];
		var link_dic = {"source": [], "target": [], "value": [], "color": [], "label": []};

		for (var i=0; i<new_net_li.length; i++) {
			var li = new_net_li[i];
			[tuple_li, txt_li] = generate_tuple(li, tuple_li, txt_li, newNodeLabel);
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

		return [node_dic, link_dic, node_args, new_net_li];
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
				totalNum += 1;
				var [li, model_arg_li] = generate_out_li(json_dic[i]);
				allProNodes.push(li);
				if (idList.includes(i)) {
					hyper[i] = json_dic[i]['hyperparameters'];			
					arg_li.push(model_arg_li);
					net_li.push(li);
					proNode[i] = li;
					if (max_length<json_dic[i]['num_layers']) {
						max_length = json_dic[i]['num_layers'];
					}
				}
				
			}
					
		})
		.then(function() {
			hyperparameterChart(hyper);
			if (viewName=='oriView') {	
				var [node_dic, link_dic, node_args, new_net_li] = generate_flow_txt(net_li, arg_li, colorDic);
				var proj = genjson(node_dic, link_dic, node_args, colorDic);
				var nodesData = [[proj, max_length, totalNum], idList, proNode, allProNodes];
				mainDraw(idList, nodesData);
				genInfo(idList, proNode, hyper);
				updateSlider('starsSvg', idList,  proNode);
				updateSlider('forksSvg', idList, proNode);
				updateSlider('numLayersSvg', idList, proNode);
			} else {
				var res = new Promise(function (resolve, reject) {
					$.ajax({
						url: "/_alignment/",
						type: "POST",
						data: JSON.stringify(idList.toString()),
						success: function(response){
							var newNetLi = [];
							var newArgLi = [];
							var countPro = 0;
							var countNodeDash = {};
							for (const pId in response) {
								var newProNetLi = [];
								var newProArgLi = [];
								var countOriNode = 0;
								var countDash = 0;
								for (var ind=0; ind<response[pId].length; ind++) {
									var nodeName = response[pId].charAt(ind);
									if (nodeName !== '-') {	
										var thisNode = arg_li[countPro][countOriNode];
										var nodeType = typedic[nodeName];
										for (var cou=1; cou<countDash+1; cou++) {
											if (nodeType in countNodeDash) {								
												countNodeDash[nodeType] += 1;
											} else {
												countNodeDash[nodeType] = 1;
											}	
											var dashName = nodeType+'-align-'+countNodeDash[nodeType];
											newProNetLi.push(dashName);
											var dashArg = {};
											dashArg[dashName] = {};
											newProArgLi.push(dashArg);									
										}
										newProNetLi.push(Object.keys(arg_li[countPro][countOriNode])[0].split("-")[0]);
										newProArgLi.push(arg_li[countPro][countOriNode]);
										countDash = 0;
										countOriNode += 1;
									}
									else {
										countDash += 1;
									}
								}
								newNetLi.push(newProNetLi);
								newArgLi.push(newProArgLi);
								countPro += 1;
							}
							var [nodeDic, linkDic, nodeArgs, new_net_li] = generate_flow_txt(newNetLi, newArgLi, colorDic);
							var proj = genjson(nodeDic, linkDic, nodeArgs, colorDic);
							
							var nodesData = [[proj, max_length, totalNum], idList, proNode, allProNodes, new_net_li];
							mainDraw(idList, nodesData);
							genInfo(idList, proNode, hyper);
							updateSlider('starsSvg', idList,  proNode);
							updateSlider('forksSvg', idList, proNode);
							updateSlider('numLayersSvg', idList, proNode);
						}
					});
				});
			}		
		})
}
