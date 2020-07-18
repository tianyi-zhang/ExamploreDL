function mainDraw(idList, nodesData) {

	var sankeyData = nodesData[0];
	var sankeyId = nodesData[1];
	var projectNodes = nodesData[2];
	if (nodesData.length==5){
		var net_li = nodesData[4];
	} else {
		var net_li = [];
	}

	genInfo(idList, projectNodes);
	drawSankey(sankeyData, sankeyId, projectNodes, net_li);
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

	var sankeyHeight = d3.max([50, idList.length*50 - 50]);
	var sankeyWidth = d3.max([(max_length+1)*100, width-100])
	
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

	var wid_svg = d3.max([(max_length+1)*100 + 70, 1200]);
	var height_svg = d3.max([800, height]);

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

	var svg = d3.select('#chart_div').append("svg")
		.attr("viewBox", `0 ${viewBoxHeight} ${wid_svg} ${height_svg}`)
		.attr('width', wid_svg)
		.attr('height', height_svg)
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
		.attr("id", 'allG');

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
		.attr("stroke-width", d => Math.max(3, d.width));


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

	if (viewBoxHeight == -250) {
		var y1 = -290;
		var y2 = 550;
	} else {
		var y1 = -110;
		var y2 = 690;
	}
	const myHeight = nodes[0]['y1']-nodes[0]['y0'];
	const myWidth = d3.max(nodes, function (d) { return d.x1;})-d3.min(nodes, function (d) { return d.x0;});
	var x2 = 1100;
	if (myWidth>1100) {
		x2 = 1200;
	}
	var zoom = d3.zoom()
			.scaleExtent([0.05, 5])
			.on('zoom', function() {
				if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
				d3.select("#allG")
					.attr('transform', d3.event.transform.toString());
				var t = d3.zoomTransform(this);
				
				var zoomed1 = t.invert([0, y1]);
				var zoomed2 = t.invert([x2, y2]);
				var xRatio = 1180/myWidth;
				var yRatio = 180/myHeight;

				var X0 = xRatio*zoomed1[0],
					Y0 = yRatio*zoomed1[1],
					W0 = xRatio*(zoomed2[0]-zoomed1[0])*1.063,
					H0 = yRatio*(zoomed2[1]-zoomed1[1]);

				var rectSelect = d3.selectAll("#thumbnailRect")
					.attr("x", X0)
					.attr("y", Y0)
					.attr("width", W0)
					.attr("height", H0);

				d3.selectAll("#n-handle")
					.attr("x", X0-3)
					.attr("y", Y0-3)
					.attr("width", W0+6)
					.attr("height", 6);

				d3.selectAll("#w-handle")
					.attr("x", X0-3)
					.attr("y", Y0-3)
					.attr("width", W0+6)
					.attr("height", 6);

				d3.selectAll("#e-handle")
					.attr("x", W0+X0-3)
					.attr("y", Y0-3)
					.attr("width", 6)
					.attr("height", H0+6);

				d3.selectAll("#s-handle")
					.attr("x", X0-3)
					.attr("y", H0+Y0-3)
					.attr("width", W0+6)
					.attr("height", 6);

				d3.selectAll("#nw-handle")
					.attr("x", X0-3)
					.attr("y", Y0-3)
					.attr("width", 6)
					.attr("height", 6);

				d3.selectAll("#ne-handle")
					.attr("x", W0+X0-3)
					.attr("y", Y0-3)
					.attr("width", 6)
					.attr("height", 6);

				d3.selectAll("#sw-handle")
					.attr("x", X0-3)
					.attr("y", H0+Y0-3)
					.attr("width", 6)
					.attr("height", 6);

				d3.selectAll("#se-handle")
					.attr("x", W0+X0-3)
					.attr("y", H0+Y0-3)
					.attr("width", 6)
					.attr("height", 6);

			})
			.on("end", function() {
				if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
				d3.select("#allG")
					.attr('transform', d3.event.transform.toString());
				var t = d3.zoomTransform(this);
				
				var zoomed1 = t.invert([0, y1]);
				var zoomed2 = t.invert([x2, y2]);
				var xRatio = 1180/myWidth;
				var yRatio = 180/myHeight;
				var X0 = xRatio*zoomed1[0],
					Y0 = yRatio*zoomed1[1],
					W0 = xRatio*(zoomed2[0]-zoomed1[0])*1.063,
					H0 = yRatio*(zoomed2[1]-zoomed1[1]);

				var rectSelect = d3.selectAll("#thumbnailRect")
					.attr("x", X0)
					.attr("y", Y0)
					.attr("width", W0)
					.attr("height", H0);

				d3.selectAll("#n-handle")
					.attr("x", X0-3)
					.attr("y", Y0-3)
					.attr("width", W0+6)
					.attr("height", 6);

				d3.selectAll("#w-handle")
					.attr("x", X0-3)
					.attr("y", Y0-3)
					.attr("width", W0+6)
					.attr("height", 6);

				d3.selectAll("#e-handle")
					.attr("x", W0+X0-3)
					.attr("y", Y0-3)
					.attr("width", 6)
					.attr("height", H0+6);

				d3.selectAll("#s-handle")
					.attr("x", X0-3)
					.attr("y", H0+Y0-3)
					.attr("width", W0+6)
					.attr("height", 6);

				d3.selectAll("#nw-handle")
					.attr("x", X0-3)
					.attr("y", Y0-3)
					.attr("width", 6)
					.attr("height", 6);

				d3.selectAll("#ne-handle")
					.attr("x", W0+X0-3)
					.attr("y", Y0-3)
					.attr("width", 6)
					.attr("height", 6);

				d3.selectAll("#sw-handle")
					.attr("x", X0-3)
					.attr("y", H0+Y0-3)
					.attr("width", 6)
					.attr("height", 6);

				d3.selectAll("#se-handle")
					.attr("x", W0+X0-3)
					.attr("y", H0+Y0-3)
					.attr("width", 6)
					.attr("height", 6);
			});

	zoom = drawThumbnail(data, idList, myWidth, myHeight, viewBoxHeight, zoom, net_li);

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