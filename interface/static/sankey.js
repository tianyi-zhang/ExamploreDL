function mainDraw(idList, nodesData, hyper) {

	var sankeyData = nodesData[0];
	var sankeyId = nodesData[1];
	var projectNodes = nodesData[2];
	if (nodesData.length==5){
		var net_li = nodesData[4];
	} else {
		var net_li = [];
	}
	hyperparameterChart(hyper);
	genInfo(idList, projectNodes);
	drawSankey(sankeyData, sankeyId, projectNodes, net_li);

	var resetG = d3.select("#resetSvg")
		.attr('width', 200)
		.attr('height', 40)
		.append('g')
		.attr('id', 'resetG')
		.attr("transform", "translate(0,0)");

	var resetRect = resetG.append('rect')
		.attr('id', 'resetRect')
		.attr('x', 50)
		.attr('y', 5)
		.attr('width', 100)
		.attr('height', 30)
		.attr('rx', 10)
		.attr("ry", 10)
		.attr('fill', "red");

	var resetText = resetG.append('text')
		.attr('text-anchor', 'middle')
		.attr('x', 100)
		.attr('y', 25)
		.text("RESET")
			.style("font-size", 20)
			.style("fill", "#ffffff");

	resetRect.on('click', function() {
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
		hyperparameterChart(hyper);
		drawSankey(sankeyData, sankeyId, projectNodes, net_li);
	});

	resetText.on('click', function() {
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
		hyperparameterChart(hyper);
		drawSankey(sankeyData, sankeyId, projectNodes, net_li);
	});
}

function dataClean(data) {
	var newDataLi = [];

	for (var i=0; i<data.length; i++) {
		var source = data[i]['source'],
			target = data[i]['target']
			flag = 0;

		for (var j=0; j<newDataLi.length; j++) {
			if (newDataLi[j]['source']==source && newDataLi[j]['target']==target) {
				newDataLi[j]['value'] += 1;
				flag = 1;
				break;
			} else {
				continue;
			}
		}
		if (flag == 0) {
			newDataLi.push(data[i]);
		} else {
			continue;
		}
	}
	return newDataLi;
}

function buildLinks(links, net_li) {
	var newLinks = [];
	for (var i=0; i<net_li.length; i++) {
		for (var j=0; j<net_li[i].length-1; j++) {
			var beginNodes = net_li[i][j],
				nextNodes = net_li[i][j+1];
			if (!(beginNodes.includes("align")) && nextNodes.includes("align")) {
				var beginPoints = [beginNodes, nextNodes],
					endNodes = nextNodes.split("-align")[0];
				for (var k=j+1; k<net_li[i].length-1; k++) {
					if (net_li[i][k].includes("align") && net_li[i][k+1]==endNodes) {
						var endPoints = [net_li[i][k], endNodes],
							flag = 0;	
						for (var l=0; l<links.length; l++) {
							if (links[l]['source']['name']==beginPoints[0] && links[l]['target']['name']==beginPoints[1]) {
								var beginLinks = links[l];
								flag += 1;
							} else if (links[l]['source']['name']==endPoints[0] && links[l]['target']['name']==endPoints[1]) {
								var endLinks = links[l];
								flag += 1;
							}
							var repeatFlag = 0;
							for (var m=0; m<newLinks.length; m++) {
								var liSource = newLinks[m]['source']['name'],
									liTarget = newLinks[m]['target']['name'];
								if (liSource == beginPoints[0] && liTarget == endPoints[1]) {
									repeatFlag = 1;
									break;
								}
							}
							if (repeatFlag == 0 && flag==2) {
								beginLinks['target']=endLinks['target'];
								beginLinks['color']=endLinks['color'];
								beginLinks['label']=beginPoints[0]+"->"+endPoints[1];
								beginLinks['y1']=endLinks['y1'];
								newLinks.push(beginLinks);
								j=k;
								break;
							} else if (repeatFlag == 1) {
								j=k;
								break;
							}
						}
						if (flag==2) {
							break;
						}
					}
				}
			} else if (!(beginNodes.includes("align")) && !(nextNodes.includes("align"))) {
				for (var l=0; l<links.length; l++) {
					if (links[l]['source']['name']==beginNodes && links[l]['target']['name']==nextNodes) {
						var repeatFlag = 0;
						for (var m=0; m<newLinks.length; m++) {
							var liSource = newLinks[m]['source']['name'],
								liTarget = newLinks[m]['target']['name'];
							if (liSource == beginNodes && liTarget == nextNodes) {
								repeatFlag = 1;
								break;
							}
						}
						if (repeatFlag == 0) {
							newLinks.push(links[l]);
						}	
						break;					
					}
				}
			}
			
		}
	}
	return newLinks;
}

function drawSankey(data, idList, projectNodes, net_li=[]) {
	d3.selectAll("#chart").remove();
	var max_length = data[1];
	var totalNum = data[2];
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
			width = (max_length+1)*100 - margin.left - margin.right,
			height = totalNum*50 - margin.top - margin.bottom;

	var sankeyHeight = idList.length*50 - 50;
	var sankeyWidth = width-100;
	
	var viewBoxHeight = 0;
	data[0]['links'] = dataClean(data[0]['links']);
	
	const _sankey = d3.sankey()
		.nodeAlign(d3[`sankey${"Left"}`])
		.nodeWidth(10)
		.nodePadding(2)
		.extent([
			[1, 1],
			[sankeyWidth, sankeyHeight]
		]);


	const sankey = ({nodes,links}) => _sankey({
		nodes: nodes.map(d => Object.assign({}, d)),
		links: links.map(d => Object.assign({}, d))
	});


	const f = d3.format(",.0f");
	const format = d => `${f(d)}`;

	var wid_svg = d3.max([(max_length+1)*100 + 70, 2000]);
	var height_svg = d3.max([780, height]);

	const {
		nodes,
		links
	} = sankey(data[0]);
	
	if (net_li.length!==0) {
		var newLinks = buildLinks(links, net_li);
	} else {
		var newLinks = links;
	}

	var newNodes = [];
	for (var i=0; i<nodes.length; i++) {
		if (!(nodes[i]['name'].includes('align'))) {
			newNodes.push(nodes[i]);
		}
	}

	var svgWidth = d3.max([2000, sankeyWidth*5]),
		svgHeight = d3.max([780, sankeyHeight*5]),
		rectWidth = d3.max([2000, sankeyWidth])
		rectHeight = d3.max([780, sankeyHeight]);

	var svg = d3.select('#chart_div').append("svg")
		.attr('width', svgWidth)
		.attr('height', svgHeight)
		.attr("id", "chart");

	var find_node_name = function (num, args_li) {
		var name_li = []
		for (i=0; i<args_li.length; i++) {
			if (args_li[i][1] === num) {
				name_li.splice(name_li.length, 0, args_li[i][0])
			}
		}
		return name_li
	}
	var allG = svg.append("g")
		.attr("id", 'allG')
		.attr("transform", "translate(0,0)");

	allG.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', rectWidth)
		.attr('height', rectHeight)
		.attr('fill', "none")
		.attr("fill-opacity", 0.0);

	allG.append("g")
		.attr("id", "rectG")
		.attr("stroke", "#000")
		.selectAll("rect")
		.data(newNodes)
		.join("rect")
			.attr("id", d => d.name.replace(" ", "_"))
			.attr("class", d => d.category.replace(" ", "_"))
			.attr("x", d => d.x0)
			.attr("y", d => d.y0)
			.attr("height", d => d.y1 - d.y0)
			.attr("width", d => d.x1 - d.x0)
			.attr("fill", d => d.color)
			.attr("stroke", d => d.color.replace("0.65", "0"))
			.attr("stroke-width", 1)
			.on("click", d => click_1(d, nodes, projectNodes))
		.append("title")
			.text(d => `${d.name}\n${format(d.value)}`);
	
	const link = allG.append("g")
		.attr("id", 'linkG')
		.attr("stroke-opacity", 1)
		.selectAll("g")
		.data(newLinks)
		.join("g")
		.style("mix-blend-mode", "multiply");

	link.append("path")
		.attr("d", d3.sankeyLinkHorizontal())
		.attr("stroke", d => d.color)
		.attr("id", function(d) {return "path" + d.target.name.replace(" ", "_");})
		.attr("class", function(d) {return "path" + d.target.category.replace(" ", "_");})
		.attr("stroke-width", d => Math.max(3, d.width))
		.on("click", d => click_1(d, nodes, projectNodes, 'links'));


	link.append("title")
		.text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

	allG.append("g")
		.attr("id", 'textG')
		.attr("font-family", "sans-serif")
		.attr("font-size", 15)
		.attr("font-weight", "100")
		.selectAll("text")
		.data(newNodes)
		.join("text")
			.attr("x", d => d.x1-15)
			.attr("y", d => (d.y1 + d.y0) / 2)
			.attr("dy", "0.355em")
			.attr("text-anchor", d => "end")
			.text(d => d.name.split("-")[0])
			.attr("fill", function(d) {
				var leName = d.name.split("-")[0]
				if (leName=='ReLu' || leName=='Sigmoid' || leName=='Linear' || leName=='tanh') {
					return "#d2dfde"
				} else {
					return "#ffffff"
				}
			});

	
	
	var zoom = d3.zoom()
			.scaleExtent([0.3, 5])
			.on('zoom', function() {
				d3.select("#allG")
					.attr('transform', d3.event.transform);})
			.on("end", function() {
				d3.select("#allG")
					.attr('transform', d3.event.transform);
				/*
				var t = d3.zoomTransform(this);
				var zoomed1 = t.invert([0, y1]);
				var zoomed2 = t.invert([x2, y2]);
				var xRatio = 2000/myWidth;
				var yRatio = 180/myHeight;
				var X0 = xRatio*zoomed1[0],
					Y0 = yRatio*zoomed1[1],
					W0 = xRatio*(zoomed2[0]-zoomed1[0]),
					H0 = yRatio*(zoomed2[1]-zoomed1[1]);

				var rectSelect = d3.selectAll("#thumbnailRect")
					.attr("x", X0)
					.attr("y", Y0)
					.attr("width", W0)
					.attr("height", H0);
				*/
				
			});

	svg.call(zoom);

	drawThumbnail(data, net_li);

	createLegend(projectNodes, nodes);
	
	d3.select('#legend-select')
		.on('change', function() {
			var newData = [];
			var selectValue = d3.select(this).property('value');
			if (selectValue !== "None") {
				for (var ind=0; ind<nodes.length; ind++) {
					if (nodes[ind].type == selectValue) {
						newData.push(nodes[ind]);
					}
				}
			}
			createLegend(projectNodes, newData, selectValue);
	});
 }