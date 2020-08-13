var click_1 = function(d, nodes, projectNodes, flag='nodes') {
	d3.selectAll(".bar").attr("fill", "#BBB5F0");
	var svg = d3.select('#chart');
	if (flag == 'nodes') {
		var nodeName = d['name'];
		svg.selectAll("rect").style("opacity", 0.35);
		svg.selectAll("path").style("opacity", 0.35);
		svg.selectAll("#"+nodeName.replace(" ", "_")).attr("stroke", "#000C3C");
		svg.selectAll("#"+nodeName.replace(" ", "_")).style("opacity", 1);
		svg.selectAll("#path" + nodeName.replace(" ", "_")).style("opacity", 1);
		var pc = generateParameterChart(d['category'], nodes, d['args']);
		var proIdList = [];
		for (const key in projectNodes) {
			if (projectNodes[key].includes(nodeName)) {
				var divId = csvData[key]['Project_Name'].replace("_", "-")+'_'+key;
				document.getElementById(divId).style.background = '#8D85EE';
			}
		}
	} else {
		var nodeName = d['target']['name'];
		svg.selectAll("rect").style("opacity", 0.35);
		svg.selectAll("path").style("opacity", 0.35);
		svg.selectAll("#"+nodeName.replace(" ", "_")).attr("stroke", "#000C3C");
		svg.selectAll("#"+nodeName.replace(" ", "_")).style("opacity", 1);
		svg.selectAll("#path" + nodeName.replace(" ", "_")).style("opacity", 1);

		for (var i=0; i<nodes.length; i++) {
			if (d.target.name == nodes[i]['name']) {
				var pc = generateParameterChart(nodes[i]['category'], nodes, nodes[i]['args']);
				break;
			}
		}
		var proIdList = [];
		for (const key in projectNodes) {
			if (projectNodes[key].includes(nodeName)) {
				var divId = csvData[key]['Project_Name'].replace("_", "-")+'_'+key;
				document.getElementById(divId).style.background = '#8D85EE';
			}
		}
	}
}
/*
var click_2 = function(d, typeDic) {
	d3.selectAll(".bar").attr("fill", "#BBB5F0");
	var svg = d3.select('#chart');
	
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff")
	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");

	for (const key in typeDic) {
		if (typeDic[key] == d) {
			svg.selectAll("." + key.replace(" ", "_")).style("opacity", 1);
			svg.selectAll(".path" + key.replace(" ", "_")).style("opacity", 1);
		}		
	} 
}

var click_3 = function(d, nodes, projectNodes) {
	d3.selectAll(".bar").attr("fill", "#BBB5F0");
	var svg = d3.select('#chart');
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff");

	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");
		  
	svg.selectAll("." + d).style("opacity", 1);	  
	svg.selectAll(".path" + d).style("opacity", 1);	 
	var chart_svg1 = generateParameterChart(d, nodes, "none");

	var proIdList = [];
	for (const key in projectNodes) {
		for (var i=0; i<projectNodes[key].length; i++) {
			if (projectNodes[key][i].includes(d)) {
				proIdList.push(key);
				break;
			}
		}		
	}
	genInfo(proIdList, projectNodes);
}
*/
var click_5 = function(nodeList, layNum, proIdList) {
	d3.selectAll(".bar").attr("fill", "#BBB5F0")
	d3.select("#layerRect"+layNum).attr("fill", "#8D85EE");

	var svg = d3.select('#chart');
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff");
	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");
	d3.selectAll('.svg_tb_td').style("border", "none");
	for (var i=0; i<nodeList.length; i++) {
		svg.selectAll("#"+nodeList[i].replace(" ", "_")).style("opacity", 1);
		svg.selectAll("#path"+nodeList[i].replace(" ", "_")).style("opacity", 1);
	}
	genInfo(proIdList, nodeList);
}