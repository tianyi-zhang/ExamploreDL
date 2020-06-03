function createLegend(projectNodes, nodesData) {
	var colorDic = {
			'Convolution': "rgba(54, 69, 133, 0.65)",
			'Max Pooling': "rgba(90, 102, 158, 0.65)",
			'Average Pooling': "rgba(163, 171, 206, 0.65)",
			'LSTM': "rgba(212, 80, 135, 0.65)",
			'GRU': "rgba(249, 93, 106, 0.65)",
			'BiRNN': "rgba(249, 93, 106, 0.65)",
			'Input': "rgba(76, 18, 1, 0.65)",
			'Dense': "rgba(176, 43, 2, 0.65)",
			'Flatten': "rgba(252, 81, 28, 0.65)",
			'Dropout': "rgba(18, 109, 52, 0.65)",
			'Attention': "rgba(152, 231, 49, 0.65)",
			'Cross Entropy': "rgba(65, 39, 89, 0.65)",
			'Optimizer': "rgba(91, 54, 125, 0.65)",					
			'ReLu': "rgba(255, 166, 1, 0.65)",
			'Sigmoid': "rgba(255, 124, 1, 0.65)",
			'Softmax': "rgba(255, 192, 1, 0.65)",
	};
	var legendArr = [];
	// {"name": "relu", "color": "rgba(255, 166, 1, 0.65)", "number": 65}

	for (const proId in projectNodes) {
		for (var i=0; i<projectNodes[proId].length; i++) {
			var flag = 0;
			var nodeName = projectNodes[proId][i].split("-")[0];

			for (var j=0; j<legendArr.length; j++) {
				
				if (nodeName == legendArr[j]["name"]) {
					legendArr[j]["number"] += 1;
					flag = 1;
					break;
				}
			}
			if (flag == 0) {
				legendArr.push({"name": nodeName, "color": colorDic[nodeName], "number": 1});
			}
		}
	}

	legendArr = bubbleSort(legendArr, "number", "<");
	

	d3.selectAll("#legendSvg").remove();
	var margin = {top: 10, right: 10, bottom: 10, left: 70},
		width = 2090 - margin.left - margin.right,
		height = 280 - margin.top - margin.bottom;

	var svg = d3.select('#chart_table').append("svg")
		.attr('width', width+margin.left+margin.right)
		.attr('height', height+margin.top+margin.bottom)
		.attr("id", "legendSvg")
		
	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	var y = d3.scaleLog()
		.range([height, 0]);

	x.domain(legendArr.map(function (d) {return d.name;}));
	y.domain([0.1, d3.max(legendArr, function (d) {return Number(d.number);})]);
	let yAxisGenerator = d3.axisLeft(y);
	yAxisGenerator.ticks(5);
	//yAxisGenerator.tickFormat(d3.format(".3"));
	g.append("g")
		.attr("transform", "translate(0," + margin.top + ")")
		.call(yAxisGenerator);

	var barG = g.append("g")
		.attr("transform", "translate(" + 0 + "," + margin.top + ")");
	barG.selectAll(".typeBar")
		.data(legendArr)
		.enter()
		.append("rect")
			.attr("class", "typeBar")
			.attr("x", d => x(d.name))
			.attr("y", d => y(d.number))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(Number(d.number)))
			.attr("fill", d => d.color)
			.on("click", function (d, i) {
				click_3(d.name.replace(" ", "_"), nodesData);
			});

	for (var ind=0; ind<legendArr.length; ind++) {
		g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", y(legendArr[ind]["number"])+70)
		.attr("x", x(legendArr[ind]["name"]) + x.bandwidth()/2)
		.text(legendArr[ind]["name"])
			.attr("font-family", "sans-serif")
			.attr("font-size", "18px")
			.attr("font-weight", "100")
			.attr("fill", "#ffffff");

		g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", y(legendArr[ind]["number"])+30)
		.attr("x", x(legendArr[ind]["name"]) + x.bandwidth()/2)
		.text(legendArr[ind]["number"])
			.attr("font-family", "sans-serif")
			.attr("font-size", "16px")
			.attr("font-weight", "100")
			.attr("fill", "#ffffff");
	}
}