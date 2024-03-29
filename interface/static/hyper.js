var genHyperLi = function(tarId, data) {
	var li = [];
	var tarDict = {};
	for (const i in data) {
		for (const arg in data[i]) {
			var flag = 0;
			for (var j=0; j<li.length; j++) {
				if (li[j]['key'] == arg) {
					li[j]['li'].push(data[i][arg]);
					flag = 1;
					break;
				}
			}
			if (flag == 0) {
				var newHyper = {'key': arg, 'li': [data[i][arg]]};
				li.push(newHyper);
			}
			if (tarId == i) {
				tarDict[arg] = [data[i][arg]];
			}	
		}
	}
	return [li, tarDict];
}
var hyperparameterChart = function(hyperData, tarId='') {
	d3.selectAll(".paraChart").remove();

	var margin = {top: 30, right: 0, bottom: 30, left: 50},
			width = 300 - margin.left - margin.right,
			height = 180 - margin.top - margin.bottom;

	var returnHyper = genHyperLi(tarId, hyperData);
	var return_li = returnHyper[0];

	var hist = function(svgThis, data) {
		if (data['key']=='Optimizer') {
			var x = d3.scaleBand()
				.rangeRound([0, width])
				.padding(0.1);
			var domainLi = [];
			for (var l=0; l<data['li'].length; l++) {
				if (!domainLi.includes(data['li'][l])) {
					domainLi.push(data['li'][l]);
				}
			}
			x.domain(domainLi);
			svgThis.append("g")
				.attr('class', 'chart2-xaxis')
				.style("font-size", "14px")
				.attr("transform", "translate(20," + (height+40) + ")")
				.call(d3.axisBottom(x));
		} else {
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
		}
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
	var text_pos = [];
	var maxNum = d3.max(return_li, function(d) { return +d.li.length;});
	var r = d3.scaleLinear()
			.range([5, 30])
			.domain([1, maxNum]);

	drawLegend("hyper", maxNum);
	for (i=0; i<return_li.length; i++) { 
		var nowKey = return_li[i].key
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

		var hyperG = mySvg.append("g")
			.attr('id', 'hyperG'+(i))
			.attr("transform", "translate(20,40)");

		hyperG.selectAll(".hyper-cir")
			.data(bins)
			.enter()
			.append("circle")
				.attr("id", nowKey)
				.attr("class", "hyper-cir")
				.attr("cx", function(d) {
					if (nowKey=='Optimizer') {
						return (x(d.name)*2+x.bandwidth())/2;
					}
					return x(d.name);
				})
				.attr("cy", d => y(d.value))
				.attr("r", d => r(d.value))
				.style("fill", function(d) {
					if (nowKey in returnHyper[1]) {
						for (k=0; k<returnHyper[1][nowKey].length; k++) {
							var target_arg_val = returnHyper[1][nowKey][k];							
							if (d.name == target_arg_val) {
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
					d3.select(this).style("fill", "#8D85EE");
					var circles = this.id,
						thisCir = d3.select(this);
					var selectG = d3.select("#"+(this.parentNode.id).replace("hyperG", "tooltipG"));
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
						.text(d.value+" projects use this value.")
						.attr("font-size","18px")
						.attr("color", "#BBB5F0");
				})
				.on("mouseout", function(d) {
					d3.selectAll("#tooltipRect").remove();
					d3.selectAll(".toolText").remove();
					d3.select(this).style("fill", function(d) {
						if (this.id in returnHyper[1]) {
							for (k=0; k<returnHyper[1][this.id].length; k++) {
								var target_arg_val = returnHyper[1][this.id][k];
								if (d.name == target_arg_val) {
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
					d3.selectAll(".hyper-cir").style("fill", "#BBB5F0");
					d3.select(this).attr("fill", "#8D85EE");
					var chartSvg = d3.select("#chart");
					chartSvg.selectAll("rect").style("opacity", 0.35);
					chartSvg.selectAll("path").style("opacity", 0.35);
					for (const key in hyperData) {
						if (hyperData[key][this.id]==d['name']) {
							var divId = csvData[key]['Project_Name'].replace("_", "-")+'_'+key;
							var highlightNodes = nodesData[2][key];
							for (var i=0; i<highlightNodes.length; i++) {
								chartSvg.select("#path"+highlightNodes[i].replace(" ", "_")).style("opacity", 1);
								chartSvg.select("#"+highlightNodes[i].replace(" ", "_")).style("opacity", 1);
							}
							document.getElementById(divId).style.background = '#8D85EE';
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
			.text("Hyperparameter: "+nowKey)
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.attr("fill", "#505050");

		if (nowKey in returnHyper[1]) {

			mySvg
				.append("rect")
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
					return nowKey+" = ["+returnHyper[1][nowKey]+"]";
				})
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.style("fill", "white");
		}
		
	}
}
