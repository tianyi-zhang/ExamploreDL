function mainDraw(idList) {

	var JSONpath = './data.json';
	resultOut = genData(idList, JSONpath);

	resultOut.then(function(data) {
		var sankeyData = data[0];
		var sankeyId = data[1];
		drawSankey(sankeyData, sankeyId);
	});
}
 
 function drawSankey(data, idList) {
 	d3.selectAll("#chart").remove();
 	var max_length = data[1];
	var totalNum = data[2];
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
			width = (max_length+1)*100 - margin.left - margin.right,
			height = totalNum*50 - margin.top - margin.bottom;

	var sankeyHeight = d3.max([50, idList.length*50 - 50]);
	var sankeyWidth = d3.max([(max_length+1)*100, width-100])
	
	var viewBoxHeight = 0;
	if (idList.length < totalNum/2) {
		viewBoxHeight = -250;
	} else if (totalNum/2 <= idList.length && idList.length  < totalNum*2/3) {
		viewBoxHeight = -100;
	}
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
		.attr("stroke", "#000")
		.selectAll("rect")
		.data(nodes)
		.join("rect")
			.attr("id", d => d.name)
			.attr("class", d => d.category)
			.attr("x", d => d.x0)
			.attr("y", d => d.y0)
			.attr("height", d => d.y1 - d.y0)
			.attr("width", d => d.x1 - d.x0)
			.attr("fill", d => d.color)
			.attr("stroke", "#ffffff")
			.on("click", function(d) {
				click_1(d);				
			})
			
		.append("title")
			.text(d => `${d.name}\n${format(d.value)}`);

	const link = svg.append("g")
		.attr("fill", "none")
		.attr("stroke-opacity", 0.35)
		.selectAll("g")
		.data(links)
		.join("g")
		.style("mix-blend-mode", "multiply");

	link.append("path")
			.attr("d", d3.sankeyLinkHorizontal())
			.attr("stroke", d => d.color)
			.attr("id", function(d) {return "path" + d.target.name;})
			.attr("class", function(d) {return "path" + d.target.category;})
			.attr("stroke-width", d => Math.max(1, d.width));


	link.append("title")
		.text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

	svg.append("g")
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
			.text(d => d.name);

	var zoom = d3.zoom()
			.scaleExtent([0.05, 5])
			.on('zoom', function() {
					svg.selectAll('path')
						.attr('transform', d3.event.transform);
					svg.selectAll('rect')
						.attr('transform', d3.event.transform);
					svg.selectAll('text')
						.attr('transform', d3.event.transform);
	});

	svg.call(zoom);

	var get_catgory = function (data) {
		var cat_dic = {};
		data.forEach(function(d) {

			if (d.type in cat_dic) {
				cat_dic[d.type][d.category] = d.color;
			} else {
				cat_dic[d.type] = {};
				cat_dic[d.type][d.category] = d.color;
			}
			
		});
		return cat_dic;
		// cat_dic = {"conv2d": "rgba()"}
	}

	var get_legend_li = function(cat_dic) {
		var legend_li = [];
		for (const key in cat_dic) {

			for (const cat in cat_dic[key]) {
				var ele = {};
				ele[cat] = cat_dic[key][cat];
				legend_li.splice(legend_li.length,0,ele);
			}
		}
		return legend_li;
	}

	var cat_dic = get_catgory(data[0].nodes);

	var cat_li = Object.keys(cat_dic);

	var legend_li = get_legend_li(cat_dic);

	var get_type_name = function(legend_li) {
		var type_li = []
		for (i=0; i<legend_li.length; i++) {
			type_li.splice(type_li.length,0,Object.keys(legend_li[i])[0]);
		}
		return type_li;
	};

	var legend_name = get_type_name(legend_li);

	d3.select("#lengendTable").remove();
	var svg_table = d3.select('#chart_table').append("table")
		.attr("id", "lengendTable");

	svg_table.append('thead')
			 .attr("id", "svg_th")
		.append('tr')
			.selectAll('#svg_th')
			.data(cat_li).enter()
			.append('th')
			.attr("id", function(d, i) {return "svg_th_tr" + i;})
			.attr("class", "svg_th_tr")
			.attr("colspan", function(d) {
				return Object.keys(cat_dic[d]).length;
			})
			.style("background-color", "#ffffff")
			.style("border-top", "1px solid #808080")
			.style("border-right", "1px solid #808080")
			.style("border-left", "1px solid #808080")
			.style("border-collapse", "collapse")
			.style("font-family", "sans-serif")
			.style("font-size", 20)
			.style("font-weight", "100")
			.text(function(d) { return d; })
			.on("click", function (d, i) {
				click_2(d, i, cat_dic);		
			});


	svg_table.append('tbody')
			.attr("id", "svg_tb")
		.append('tr')
			.attr("id", "svg_tb_tr")
			.selectAll('#svg_tb')
			.data(legend_name).enter()
			.append('td')
				.attr("id", function(d, i) {return "svg_tb_td"+d;})
				.attr("class", "svg_tb_td")
				.style("background-color", function(d, i) {
					return legend_li[i][d];
				})
				.style("border", "none")
				.text(function(d) { return d; })
				.on("click", function (d, i) {
					click_3(d, nodes);
				});
 }