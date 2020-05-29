var click_1 = function(d, projectNodes) {
	d3.selectAll(".bar").attr("fill", "steelblue")
	var recordArgs = [d];
	var svg = d3.select('#chart');
	addRecord("Picked", d.name, {"click_1": recordArgs});
	d3.selectAll(".newProjectDiv").attr("style", "background-color: #8d99ae;");
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff")
	svg.selectAll("#"+d.name).attr("stroke", "#000C3C")
	svg.selectAll("."+d.category).style("opacity", 1);
	var pc = generateParameterChart(d.category, [d], "#chart2", d.args);
	for (const key in projectNodes) {
		if (projectNodes[key].includes(d.name)) {
			d3.select("#"+"info-"+key).attr("style", "background-color: #DB0045;");
		}
	}
}

var click_2 = function(d, i, cat_dic) {
	d3.selectAll(".bar").attr("fill", "steelblue")
	var recordArgs = [d, i, cat_dic];
	var svg = d3.select('#chart');
	d3.selectAll(".newProjectDiv").attr("style", "background-color: #8d99ae;");
	addRecord("Selected", d, {"click_2": recordArgs});
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff")
	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");

	d3.selectAll('.svg_tb_td').style("border", "none")
	d3.select('#svg_th_tr'+i).style("border", "3px solid black")
	var class_name_li = Object.keys(cat_dic[d]);   
	for (j=0; j<class_name_li.length; j++) {
		svg.selectAll("." + class_name_li[j]).style("opacity", 1);
	} 
}

var click_3 = function(d,nodes) {
	d3.selectAll(".bar").attr("fill", "steelblue")
	var recordArgs = [d, nodes];
	var svg = d3.select('#chart');
	d3.selectAll(".newProjectDiv").attr("style", "background-color: #8d99ae;");
	addRecord("Selected", d, {"click_3": recordArgs});
	svg.selectAll("path").style("opacity", 0.35);
	svg.selectAll("rect").style("opacity", 0.35);
	svg.selectAll("rect").attr("stroke", "#ffffff")

	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");

	d3.selectAll('.svg_tb_td').style("border", "none")
	d3.select("#svg_tb_td"+d).style("border", "3px solid black")
		  
	svg.selectAll("." + d).style("opacity", 1);	  
		  
	var chart_svg1 = generateParameterChart(d, nodes, "#chart2", "none");
}

var click_4 = function() {
	d3.selectAll(".bar").attr("fill", "steelblue")
	d3.selectAll(".newProjectDiv").attr("style", "background-color: F5F4F2;");
	var svg = d3.select('#chart');
	svg.selectAll("path").style("opacity", 0.65);
	svg.selectAll("rect").style("opacity", 0.65);
	svg.selectAll("rect").attr("stroke", "#ffffff");
	var all_th = d3.selectAll('.svg_th_tr')
		.style("border-top", "1px solid #848484")
		.style("border-right", "1px solid #848484")
		.style("border-left", "1px solid #848484")
		.style("border-bottom", "none")
		.style("border-collapse", "collapse");
	d3.selectAll('.svg_tb_td').style("border", "none");
	d3.selectAll(".chart2-text").remove();
	d3.selectAll(".chart2-rect").remove();
	d3.selectAll(".chart2-xaxis").remove();
	d3.selectAll(".breadcrumbDiv").remove();
}

var click_5 = function(nodeList, layNum, proIdList) {
	d3.selectAll(".bar").attr("fill", "steelblue")
	d3.select("#layerRect"+layNum)
		.attr("fill", "#fca311");
	d3.selectAll(".newProjectDiv").attr("style", "background-color: #8d99ae;");
	var recordArgs = [nodeList, layNum];
	var svg = d3.select('#chart');
	addRecord("Project Length", layNum+" Layers", {"click_5": recordArgs});
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
		svg.selectAll("#"+nodeList[i]).style("opacity", 1);
		svg.selectAll("#path"+nodeList[i]).style("opacity", 1);
	}
	for (var j=0; j<proIdList.length; j++) {
		d3.select("#"+"info-"+proIdList[j]).attr("style", "background-color: #DB0045;");
	}
}

var click_6 = function(nodeList, projectId) {
	d3.selectAll(".bar").attr("fill", "steelblue");
	d3.select("#layerRect"+nodeList.length).attr("fill", "#DB0045");
	d3.selectAll(".newProjectDiv").attr("style", "background-color: #8d99ae;");
	d3.select("#"+"info-"+projectId).attr("style", "background-color: #DB0045;");
	var recordArgs = [nodeList, projectId];
	var svg = d3.select('#chart');
	addRecord("Git", projectId+" project", {"click_6": recordArgs});
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
	for (var l=0; l<nodeList.length; l++) {
		svg.selectAll("#"+nodeList[l]).style("opacity", 1);
		svg.selectAll("#path"+nodeList[l]).style("opacity", 1);
	}
}