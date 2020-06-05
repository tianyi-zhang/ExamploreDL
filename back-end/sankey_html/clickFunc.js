var click_1 = function(d, nodes, projectNodes, appendNow='pass in') {

	var nodeName = d.name.split("-")[0];
	d3.selectAll(".bar").attr("fill", "#BBB5F0")
	var recordArgs = [d, projectNodes];
	var svg = d3.select('#chart');
	if (appendNow=="pass in") {
		addRecord("", nodeName, {"click_1": recordArgs});
	}

	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff");
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("#"+d.name.replace(" ", "_")).attr("stroke", "#000C3C");
	svg.selectAll("#"+d.name.replace(" ", "_")).style("opacity", 1);
	svg.selectAll("#path" + d.name.replace(" ", "_")).style("opacity", 1);
	var pc = generateParameterChart(d.category, nodes, d.args);
	var proIdList = [];
	for (const key in projectNodes) {
		if (projectNodes[key].includes(d.name)) {
			proIdList.push(key);
		}
	}
	hightlightInfo(proIdList);
}

var click_2 = function(d, typeDic, appendNow='pass in') {
	d3.selectAll(".bar").attr("fill", "#BBB5F0")
	var recordArgs = [d, typeDic];
	var svg = d3.select('#chart');

	if (appendNow=="pass in") {
		addRecord("#8D85EE", d, {"click_2": recordArgs});
	}
	
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

var click_3 = function(d, nodes, projectNodes, appendNow='pass in') {
	d3.selectAll(".bar").attr("fill", "#BBB5F0")
	var recordArgs = [d, nodes, projectNodes];
	var svg = d3.select('#chart');
	if (appendNow=="pass in") {
		addRecord("", d, {"click_3": recordArgs});
	}
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff")

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
	hightlightInfo(proIdList);
}

var click_4 = function() {
	d3.selectAll(".bar").attr("fill", "#BBB5F0")
	var svg = d3.select('#chart');
	svg.selectAll("path").style("opacity", 1);
	svg.selectAll("rect").style("opacity", 1);
	svg.selectAll("rect").attr("stroke", "#ffffff");
	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");

	d3.selectAll(".chart2-text").remove();
	d3.selectAll(".chart2-rect").remove();
	d3.selectAll(".chart2-xaxis").remove();
	d3.selectAll(".breadcrumbDiv").remove();
}

var click_5 = function(nodeList, layNum, proIdList, appendNow='pass in') {
	d3.selectAll(".bar").attr("fill", "#BBB5F0")
	d3.select("#layerRect"+layNum).attr("fill", "#8D85EE");

	var recordArgs = [nodeList, layNum, proIdList];
	var svg = d3.select('#chart');
	if (appendNow=="pass in") {
		addRecord("#8D85EE", layNum+" Layers", {"click_5": recordArgs});
	}
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
	hightlightInfo(proIdList);
}