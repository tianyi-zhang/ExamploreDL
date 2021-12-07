function bubbleSort (arr, key, flag=">") {
	var max = arr.length - 1;
	for (var j = 0; j < max; j++) {
		var done = true;
		for (var k = 0; k < max - j; k++) {
			if (flag == ">") {
				if (arr[k][key] > arr[k + 1][key]) {
					var temp = arr[k];
					arr[k] = arr[k + 1];
					arr[k + 1] = temp;
					done = false;
				}
			} else {
				if (arr[k][key] < arr[k + 1][key]) {
					var temp = arr[k];
					arr[k] = arr[k + 1];
					arr[k + 1] = temp;
					done = false;
				}
			}
		}
		if (done) {
			break;
		}
	}
	return arr;
}

function drawLegend(legendType, maxNum) {
	d3.selectAll("#paraLegend").remove();
	var leng = d3.select("#paraLegendDiv").append("svg")
		.attr("id", "paraLegend")
		.attr("width", 300)
		.attr("height", 120);

	var rect_1 = leng.append("rect")
		.attr("class", "legend")
		.attr("y", 5)
		.attr("x", 15)
		.attr("width", "20px")
		.attr("height", "20px")
		.attr("fill", "#8D85EE")
		.attr("rx", 5)
		.attr("ry", 5);

	leng.append("text")
		.attr("class", "legend")
		.attr("text-anchor", "start")
		.attr("y", 20)
		.attr("x", 40)
		.text(function() {
			if (legendType=='hyper') {
				document.getElementById("paraHeadName").innerHTML = "Hyperparameters";
				return "hyperparameters of selected project";
			} else {
				document.getElementById("paraHeadName").innerHTML = "Parameters";
				return "parameters of selected nodes";
			}
		})
		.style("font-family", "sans-serif")
		.attr("font-size","16px")
		.attr("font-weight", 100)
		.style("fill", "#7F7F7F");

	var rect_2 = leng.append("rect")
		.attr("class", "legend")
		.attr("y", 30)
		.attr("x", 15)
		.attr("width", "20px")
		.attr("height", "20px")
		.attr("fill", "#BBB5F0")
		.attr("rx", 5)
		.attr("ry", 5);

	leng.append("text")
		.attr("class", "legend")
		.attr("text-anchor", "start")
		.attr("y", 45)
		.attr("x", 40)
		.text(function() {
			if (legendType=='hyper') {
				return "hyperparameters of other project";
			} else {
				return "parameters of other nodes";
			}
		})
		.style("font-family", "sans-serif")
		.attr("font-size","16px")
		.attr("font-weight", 100)
		.style("fill", "#7F7F7F");

	leng.append("circle")
		.attr("cx", 60)
		.attr("cy", 110)
		.attr("r", 5)
		.attr("fill", "none")
		.style("stroke", "#ccc")
		.style("stroke-dasharray", "4 2");

	leng.append("circle")
		.attr("cx", 60)
		.attr("cy", 85)
		.attr("r", 30)
		.attr("fill", "none")
		.style("stroke", "#ccc")
		.style("stroke-dasharray", "4 2");

	leng.append("line")
		.attr("id", "line1")
		.attr("x1", 65)
		.attr("y1", 110)
		.attr("x2", 120)
		.attr("y2", 110)
		.attr("fill", "none")
		.style("stroke", "black")
		.style("stroke-width", 1);

	leng.append("line")
		.attr("id", "line2")
		.attr("x1", 90)
		.attr("y1", 85)
		.attr("x2", 120)
		.attr("y2", 85)
		.attr("fill", "none")
		.style("stroke", "black")
		.style("stroke-width", 1);

	leng.append("text")
		.attr("class", "legend")
		.attr("text-anchor", "start")
		.attr("y", 115)
		.attr("x", 120)
		.text(function() {
			if (legendType=='hyper') {
				return "1 project use";
			} else {
				return "1 layer use";
			}
		})
		.style("font-family", "sans-serif")
		.attr("font-size","16px")
		.attr("font-weight", 100)
		.style("fill", "#7F7F7F");

	leng.append("text")
		.attr("class", "legend")
		.attr("text-anchor", "start")
		.attr("y", 90)
		.attr("x", 120)
		.text(function() {
			if (legendType=='hyper') {
				return maxNum+" projects use";
			} else {
				return maxNum+" layers use";
			}
		})
		.style("font-family", "sans-serif")
		.attr("font-size","16px")
		.attr("font-weight", 100)
		.style("fill", "#7F7F7F");
}

var get_data = function(d_node, selected_cat) {
	// d_node = data.nodes
	var return_li = [];
	//[{"key": "filters", "values" : [{"arg_value": 128, "frequency": 3, "name": ["conv2d-1"]}, {"arg_value": 64, "frequency": 2, "name": ["conv2d-2"]}], "li": [128, 128, 128, 64, 64, 64]}, {"key":"strides", "arg_value": [{"value": 2, "frequency": 3, "name": ["conv2d-1"]}], "li": [2, 2, 2]}]
	for (i=0; i<d_node.length; i++) {
		
		if (d_node[i].category === selected_cat) {
			var d_node_arg_li = Object.keys(d_node[i]["args"]);
			for (j=0; j<d_node_arg_li.length; j++) {
				// get arg name: tar_key
				
				var li_keys = {};
				// {"filters": 0}
				for (m=0; m<return_li.length; m++) {
					li_keys[return_li[m].key] = m;
				}
				
				var arg_name = d_node_arg_li[j];
				if (arg_name=='name') {
					continue;
				}
				var val_li = d_node[i]["args"][arg_name];
				
				if (Object.keys(li_keys).includes(arg_name)) {
					// get the value list of args_data_dic

					
					// traverse each value in args_data_dic
					for (k=0; k<val_li.length; k++) {
						return_li[li_keys[arg_name]]["li"].splice(return_li[li_keys[arg_name]]["li"].length,0,val_li[k]);
						var val_dic = {};
						var return_li_arg_name_value = return_li[li_keys[arg_name]]["values"];
						for (l=0; l<return_li_arg_name_value.length; l++) {
							val_dic[return_li_arg_name_value[l]["arg_value"]] = l;
						}
						
						if (Object.keys(val_dic).includes('' + val_li[k])) {
							var add_position = return_li_arg_name_value[val_dic[val_li[k]]];
							add_position["frequency"] = add_position["frequency"] + 1;
							add_position["name"].splice(add_position["name"].length,0,d_node[i].name);
						} else {
							var add_position = return_li_arg_name_value;
							var new_dic = {"arg_value": val_li[k], "frequency": 1, "name": [d_node[i].name]};
							add_position.splice(add_position.length,0,new_dic);
						}
					}
				} else {
					
					var new_arg_dic = {"key": arg_name, "values": [], "li": []};
					for (k=0; k<val_li.length; k++) {
						new_arg_dic["li"].splice(new_arg_dic["li"].length,0,val_li[k]);
						var val_dic = {};
						var return_li_arg_name_value = new_arg_dic["values"];
						for (l=0; l<return_li_arg_name_value.length; l++) {
							val_dic[return_li_arg_name_value[l]["arg_value"]] = l;
						}
						if (Object.keys(val_dic).includes('' + val_li[k])) {
							var add_position = new_arg_dic["values"][val_dic[val_li[k]]];
							add_position["frequency"] = add_position["frequency"] + 1;
							add_position["name"].splice(add_position["name"].length,0,d_node[i].name);
						} else {
							var new_dic = {"arg_value": val_li[k], "frequency": 1, "name": [d_node[i].name]};
							new_arg_dic["values"].splice(new_arg_dic["values"].length,0,new_dic);
						}
						
					}
					return_li.splice(return_li.length,0,new_arg_dic);
				}
			}
		}
	}
	
	for (i=0; i<return_li.length; i++) {

		var return_li_val = return_li[i]["values"];
		return_li[i]["values"] = bubbleSort(return_li_val, "arg_value");

	}
	return return_li;
}

var generateParameterChart = function(selected_cat, jsonData, target_args) {

	d3.selectAll(".paraChart").remove();

	var margin = {top: 30, right: 0, bottom: 30, left: 50},
			width = 300 - margin.left - margin.right,
			height = 180 - margin.top - margin.bottom;
	var return_li = get_data(jsonData, selected_cat);

	var hist = function(svgThis, data) {

		var num_sticks = 5,
			maxX = d3.max(data['li']);
		var x = d3.scaleLinear()
			.domain([0, maxX ]) 
			.range([0, width]);

		svgThis.append("g")
			.attr('class', 'chart2-xaxis')
			.style("font-size", "14px")
			.attr("transform", "translate(20," + (height+40) + ")")
			.call(d3.axisBottom(x).ticks(num_sticks));

		// set the parameters for the histogram
		var bins = [];
		for (var i=0; i<data['li'].length; i++) {
			var flag = 0;
			for (var j=0; j<bins.length; j++) {
				if (bins[j]['name']==data['li'][i]) {
					bins[j]['value'] += 1;
					flag = 1;
					break;
				}
			}
			if (flag == 0) {
				bins.push({"name": data['li'][i], "value": 1})
			}
		}
		var y = d3.scaleLinear()
			.range([height, 40])
			.domain([0, d3.max(bins, function(d) { return +d.value;}) ]);	 
		return [x, y, bins]
	}
	var maxNum = d3.max(return_li, function(d) { return +d.li.length;});
	var r = d3.scaleLinear()
			.range([5, 30])
			.domain([1, maxNum]);

	drawLegend("parameters", maxNum);
	var text_pos = [];
	for (i=0; i<return_li.length; i++) { 	

		var nowKey = return_li[i].key;
		var mySvg = d3.select("#paraChart").append("svg")
			.attr("id", 'paraSvg-'+i)
			.attr("class", "paraChart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		[x, y, bins] = hist(mySvg, return_li[i]);
		var inside_li = [];

		var tooltipG = mySvg.append("g")
			.attr('id', 'tooltipG'+(i))
			.attr("transform", "translate(0,40)");

		var paraG = mySvg.append("g")
			.attr('id', 'paraG'+(i))
			.attr("transform", "translate(20,40)");

		paraG.selectAll(".para-cir")
			.data(bins)
			.enter()
			.append("circle")
				.attr("id", nowKey)
				.attr("class", "para-cir")
				.attr("cx", d => x(d.name))
				.attr("cy", d => y(d.value))
				.attr("r", d=>r(d.value))
				.style("fill", function(d) {
					if (Object.keys(target_args).includes(nowKey)) {
						for (k=0; k<target_args[nowKey].length; k++) {
							var target_arg_val = target_args[nowKey][k];
							
							if (d.name == target_arg_val+"") {
								flag = 1;
								return "#8D85EE";
							}
						}
						return "#BBB5F0";
					} else {
						return "#BBB5F0";
					}
				})
				.attr('fill-opacity', 0.7)
				.on("mouseover", function(d) {
					d3.selectAll("#tooltipRect").remove();
					d3.selectAll(".toolText").remove();
					var selectG = d3.select("#"+(this.parentNode.id).replace("paraG", "tooltipG"));
					d3.select(this).style("fill", "#8D85EE");
					var toolRect = selectG.append("rect")
						.attr("id", "tooltipRect")
						.attr("x", 50)
						.attr("y", 40)
						.attr("height", 50)
						.attr("width", 230)
						.attr("rx", 6)
	 					.attr("ry", 6)
						.attr("fill", "#ccc")
						.attr("opacity", 0.7);

					var topicText = selectG.append("text")
						.attr("class", "toolText")
						.attr("x", 60)
						.attr("y", 60)
						.text(this.id+": "+d.name)
						.attr("font-size","18px")
						.attr("color", "#BBB5F0");

					var valueText = selectG.append("text")
						.attr("class", "toolText")
						.attr("x", 60)
						.attr("y", 80)
						.text(d.value+" layers use this value.")
						.attr("font-size","18px")
						.attr("color", "#BBB5F0");
				})
				.on("mouseout", function(d) {
					d3.selectAll("#tooltipRect").remove();
					d3.selectAll(".toolText").remove();
					d3.select(this).style("fill", function(d) {
						if (Object.keys(target_args).includes(this.id)) {
							for (k=0; k<target_args[this.id].length; k++) {
								var target_arg_val = target_args[this.id][k];
								
								if (d.name == target_arg_val+"") {
									flag = 1;
									return "#8D85EE";
								}
							}
							return "#BBB5F0";
						} else {
							return "#BBB5F0";
						}
					});
				})
				.on("click", function(d) {
					d3.selectAll(".chart2-text").remove();
					d3.selectAll(".para-cir").style("fill", "#BBB5F0");
					d3.select(this).attr("fill", "#8D85EE");
					var chartSvg = d3.select("#chart");
					chartSvg.selectAll("rect").style("opacity", 0.35);
					chartSvg.selectAll("path").style("opacity", 0.35);
					for (var i=0; i<jsonData.length; i++) {
						if (jsonData[i]['args'][this.id] == d['name']) {
							chartSvg.select("#path"+jsonData[i]['name'].replace(" ", "_")).style("opacity", 1);
							chartSvg.select("#"+jsonData[i]['name'].replace(" ", "_")).style("opacity", 1);
						}	
					}
				});

		text_pos.push(inside_li); 
		
		for (j=0; j<inside_li.length; j++) {

			mySvg
				.append("text")
				.attr("class", "chart2-text")
				.attr("text-anchor", "middle")
				.attr("y", (height+35))
				.attr("x", (inside_li[j][1]+20))
				.text(inside_li[j][0])
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.style("fill", "#ffffff")
		}

		mySvg
			.append("text")
			.attr("class", "chart2-header")
			.attr("text-anchor", "middle")
			.attr("y", 20)
			.attr("x", (width/2+20))
			.text("Parameter: "+nowKey)
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.attr("fill", "#505050");

		if (target_args !== "none" && (nowKey in target_args)) {
			var selectText = mySvg.append("rect")
				.attr("class", "chart2-text")
				.attr("y", 35)
				.attr("x", 0)
				.attr("width", "100%")
				.attr("height", "30px")
				.attr("fill", "#8D85EE")
				.attr("rx", 6)
				.attr("ry", 6);

			mySvg
				.append("text")
				.attr("class", "chart2-text")
				.attr("text-anchor", "middle")
				.attr("y", 55)
				.attr("x", (width/2+20))
				.text(function() {
					if (target_args[nowKey].length == 0) {
						return false;
					} else {
						var paraVal = target_args[nowKey].sort( function( a , b){
						    if(a > b) return 1;
						    if(a < b) return -1;
						    return 0;
						});
						return nowKey+" = ["+paraVal+"]";
					}
				})
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.style("fill", "white");
		}
		
	}
}
