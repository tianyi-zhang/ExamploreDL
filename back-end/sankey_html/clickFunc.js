var click_1 = function(d) {
	var recordArgs = [d];
    var svg = d3.select('#chart');
	addRecord("Hightlight: " + d.name + " node.", {"click_1": recordArgs});
    d3.selectAll('#svg_th_tr').style("border", "1px solid #848484")
    d3.selectAll('#svg_tb_td').style("border", "1px solid #848484")
    svg.selectAll("rect").style("opacity", 0.35);
    svg.selectAll("rect").attr("stroke", "#ffffff")
    svg.selectAll("#"+d.name).attr("stroke", "#000C3C")
    svg.selectAll("."+d.category).style("opacity", 1);
    var pc = generateParameterChart(d.category, [d], "#chart2", d.args);
}

var click_2 = function(d, i, cat_dic) {
	var recordArgs = [d, i, cat_dic];
    var svg = d3.select('#chart');
	addRecord("Filter left: All " + d + " types.", {"click_2": recordArgs});
	svg.selectAll("path").style("opacity", 0.35);
    svg.selectAll("rect").style("opacity", 0.35);
    svg.selectAll("rect").attr("stroke", "#ffffff")
    d3.selectAll('.svg_th_tr').style("border", "1px solid #848484")
    d3.selectAll('.svg_tb_td').style("border", "1px solid #848484")
    d3.select('#svg_th_tr'+i).style("border", "3px solid black")
    var class_name_li = Object.keys(cat_dic[d]);   
    for (j=0; j<class_name_li.length; j++) {
        svg.selectAll("." + class_name_li[j]).style("opacity", 1);
    } 
}

var click_3 = function(d,nodes) {
	var recordArgs = [d, nodes];
    var svg = d3.select('#chart');
	addRecord("Filter left: All " + d + " nodes.", {"click_3": recordArgs});
	svg.selectAll("path").style("opacity", 0.35);
    svg.selectAll("rect").style("opacity", 0.35);
    svg.selectAll("rect").attr("stroke", "#ffffff")
    d3.selectAll('.svg_th_tr').style("border", "1px solid #848484")
    d3.selectAll('.svg_tb_td').style("border", "1px solid #848484")
    d3.select("#svg_tb_td"+d).style("border", "3px solid black")
          
    svg.selectAll("." + d).style("opacity", 1);      
          
    var chart_svg1 = generateParameterChart(d, nodes, "#chart2", "none");
}

var click_4 = function(x0, x1, nowKey, hightlightNodes, selected_cat, newNodeData) {
    var svg = d3.select('#chart');
	var recordArgs = [x0, x1, nowKey, hightlightNodes, selected_cat, newNodeData];
	svg.selectAll("rect").style("opacity", 0.35);
	addRecord("Filter left args: All (" + x0 + " <= " + nowKey + " <= " + x1 +	") nodes.", {"click_4": recordArgs});
	for (j=0; j<hightlightNodes.length; j++) {
		svg.selectAll("#"+hightlightNodes[j]).style("opacity", 1);
	}	 
	generateParameterChart(selected_cat, newNodeData, "#chart2", "none");
}

var click_5 = function(nodeList, layNum) {
    console.log(layNum);
    var recordArgs = [nodeList, layNum];
    var svg = d3.select('#chart');
    addRecord("Filter left: Project with number of layers = " + layNum, {"click_5": recordArgs});
    svg.selectAll("path").style("opacity", 0.35);
    svg.selectAll("rect").style("opacity", 0.35);
    svg.selectAll("rect").attr("stroke", "#ffffff")
    d3.selectAll('.svg_th_tr').style("border", "1px solid #848484")
    d3.selectAll('.svg_tb_td').style("border", "1px solid #848484")
    for (var i=0; i<nodeList.length; i++) {
        svg.selectAll("#"+nodeList[i]).style("opacity", 1);
        svg.selectAll("#path"+nodeList[i]).style("opacity", 1);
    }
}