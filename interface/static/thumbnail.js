function drawThumbnail(data, idList, sankeyWidth, sankeyHeight, VBH, zoom, net_li) {
	d3.selectAll("#thumbnail").remove();

	var margin = {top: 10, right: 10, bottom: 10, left: 10},
			width = 1180,
			height = 180;
	
	const _sankey = d3.sankey()
		.nodeAlign(d3[`sankey${"Left"}`])
		.nodeWidth(8)
		.nodePadding(1)
		.extent([
			[1, 1],
			[width, height]
		]);


	const sankey = ({nodes,links}) => _sankey({
		nodes: nodes.map(d => Object.assign({}, d)),
		links: links.map(d => Object.assign({}, d))
	});

	const f = d3.format(",.0f");
	const format = d => `${f(d)}`;

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

	var thumbSvg = d3.select('#thumbnailDiv').append("svg")
		.attr('width', width)
		.attr('height', height)
		.attr("id", "thumbnail");

	var find_node_name = function (num, args_li) {
		var name_li = []
		for (i=0; i<args_li.length; i++) {
			if (args_li[i][1] === num) {
				name_li.splice(name_li.length, 0, args_li[i][0])
			}
		}
		return name_li
	}

	thumbSvg.append("g")
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
			.attr("stroke", function(d) {
				if (d.name.includes('align')) {
					return d.color.replace("0.65", "0");
				} else {
					return "#ffffff";
				}
			})
			.attr("stroke-width", 0);

	const link = thumbSvg.append("g")
		.attr("fill", "none")
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

	var thumbBrush = d3.brush()
		.extent([[0, 0], [width, height]])
		.on("end", brushed);

	var thumbBrushG = d3.selectAll("#thumbnail").append('g')
		.attr("id", "thumbBrushG")
		.call(thumbBrush);

	thumbBrushG.call(thumbBrush.move, [[0, 0], [1180, 180]]);

	thumbBrushG.selectAll(".selection")
		.attr("id", "thumbnailRect");

	thumbBrushG.selectAll(".handle.handle--n")
		.attr("id", "n-handle");

	thumbBrushG.selectAll(".handle.handle--w")
		.attr("id", "w-handle");

	thumbBrushG.selectAll(".handle.handle--e")
		.attr("id", "e-handle");

	thumbBrushG.selectAll(".handle.handle--s")
		.attr("id", "s-handle");

	thumbBrushG.selectAll(".handle.handle--nw")
		.attr("id", "nw-handle");

	thumbBrushG.selectAll(".handle.handle--ne")
		.attr("id", "ne-handle");

	thumbBrushG.selectAll(".handle.handle--sw")
		.attr("id", "sw-handle");

	thumbBrushG.selectAll(".handle.handle--se")
		.attr("id", "se-handle");

	d3.select("#chart").call(zoom);

	function brushed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
		if (!d3.event.sourceEvent) return;
		var s = d3.event.selection;
		var brushW = s[1][0] - s[0][0];
		var brushH = s[1][1] - s[0][1];
		var magnify1 = 180*800/(sankeyHeight*brushH),
			magnify2 = 1180*1200/(sankeyWidth*brushW);
		var magnify = d3.min([magnify1, magnify2]);

		let elem = document.querySelector('#rectG');
		let rect = elem.getBoundingClientRect();
		var rectTop = rect['top'];
		var rectLeft = rect['left'];
		
		var moveX=s[0][0]*sankeyWidth/1180;
		var moveY=s[0][1]*sankeyHeight/180+VBH;
		var transform = d3.zoomIdentity
			.scale(magnify)
			.translate(-moveX, -moveY);

		d3.selectAll("#rectG").call(zoom.transform, transform);
		d3.selectAll("#linkG").call(zoom.transform, transform);
		d3.selectAll("#textG").call(zoom.transform, transform);
	}
}