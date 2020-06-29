function mainDraw(idList, nodesData) {

	var sankeyData = nodesData[0];
	var sankeyId = nodesData[1];
	var projectNodes = nodesData[2];

	genInfo(idList, projectNodes);
	drawSankey(sankeyData, sankeyId, projectNodes);
}
 
function drawSankey(data, idList, projectNodes) {
	d3.selectAll("#chart").remove();
	var max_length = data[1];
	var totalNum = data[2];
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
			width = (max_length+1)*100 - margin.left - margin.right,
			height = totalNum*50 - margin.top - margin.bottom;

	var sankeyHeight = d3.max([50, idList.length*50 - 50]);
	var sankeyWidth = d3.max([(max_length+1)*100, width-100])
	
	var viewBoxHeight = 0;
	/*
	if (idList.length < totalNum/2) {
		viewBoxHeight = -250;
	} else if (totalNum/2 <= idList.length && idList.length  < totalNum*2/3) {
		viewBoxHeight = -100;
	}
	*/
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

	var wid_svg = (max_length+1)*100 + 70;
	var height_svg = height;

	const {
		nodes,
		links
	} = sankey(data[0]);

	var svg = d3.select('#chart_div').append("svg")
		.attr("viewBox", `0 ${viewBoxHeight} ${wid_svg} ${height_svg}`)
		.attr('width', width+margin.left+margin.right)
		.attr('height', height_svg+margin.top+margin.bottom)
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

	svg.append("g")
		.attr("id", "rectG")
		.attr("stroke", "#000")
		.selectAll("rect")
		.data(nodes)
		.join("rect")
			.attr("id", d => d.name.replace(" ", "_"))
			.attr("class", d => d.category.replace(" ", "_"))
			.attr("x", d => d.x0)
			.attr("y", d => d.y0)
			.attr("height", d => d.y1 - d.y0)
			.attr("width", d => d.x1 - d.x0)
			.attr("fill", function(d) {
				if (d.name.includes('align')) {
					return d.color.replace('0.65', '0.4225');
				} else {
					return d.color;
				}
			})
			.attr("stroke", '#ffffff')
			.attr("stroke-width", function(d) {
				if (d.name.includes('align')) {
					return 0;
				} else {
					return 3;
				}
			})
			.on("click", function(d) {
				if (!d.name.includes('align')) {
					click_1(d, nodes, projectNodes);
				}				
			})
			
		.append("title")
			.text(function(d) {
				if (d.name.includes('align')) {
					return '';
				} else {
					return `${d.name}\n${format(d.value)}`
				}
			});

	const link = svg.append("g")
		.attr("id", 'linkG')
		.attr("fill", "none")
		.attr("stroke-opacity", 0.65)
		.selectAll("g")
		.data(links)
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

	svg.append("g")
		.attr("id", 'textG')
		.attr("font-family", "sans-serif")
		.attr("font-size", 15)
		.attr("font-weight", "100")
		.attr("fill", "#505050")
		.selectAll("text")
		.data(nodes)
		.join("text")
			.attr("x", d => d.x1-15)
			.attr("y", d => (d.y1 + d.y0) / 2)
			.attr("dy", "0.355em")
			.attr("text-anchor", d => "start")
			.text(function(d) {
				if (d.name.includes('align')) {
					return '';
				} else {
					return d.name.split("-")[0];
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
	//drawThumbnail(data, idList, myWidth, myHeight);
	var x2 = 1100;
	if (myWidth>1100) {
		x2 = 1200;
	}
	//zoomBrush(nodes, thumbNodes, [sankeyWidth, sankeyWidth]);
	var zoom = d3.zoom()
			.scaleExtent([0.05, 5])
			.on('zoom', function() {
				svg.selectAll('path')
					.attr('transform', d3.event.transform.toString());
				svg.selectAll('rect')
					.attr('transform', d3.event.transform.toString());
				svg.selectAll('text')
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
				svg.selectAll('path')
					.attr('transform', d3.event.transform.toString());
				svg.selectAll('rect')
					.attr('transform', d3.event.transform.toString());
				svg.selectAll('text')
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

	drawThumbnail(data, idList, myWidth, myHeight, viewBoxHeight, zoom);
	svg.call(zoom);

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