function createLegend(projectNodes, nodesData, nodesType='None') {
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
	var typeDic = {
		'Convolution': "CNN",
		'Max Pooling': "CNN",
		'Average Pooling': "CNN",
		'LSTM': "RNN",
		'GRU': "RNN",
		'BiRNN': "RNN",
		'Input': "Other",
		'Dense': "Other",
		'Flatten': "Other",
		'Dropout': "Other",
		'Attention': "Other",
		'Cross Entropy': "Other",
		'Optimizer': "Other",					
		'ReLu': "Activate",
		'Sigmoid': "Activate",
		'Softmax': "Activate",
	}
	if (nodesType !== "None") {
		click_2(nodesType, typeDic);
	}
	var legendArr = [];
	// {"name": "relu", "color": "rgba(255, 166, 1, 0.65)", "number": 65}
	for (const key in typeDic) {
		if (nodesType !== "None") {
			if (typeDic[key] !== nodesType) {
				continue;
			}
		}
		var nodeLengend = {"name": key, "color": colorDic[key], "number": 0};
		for (const proId in projectNodes) {
			for (var i=0; i<projectNodes[proId].length; i++) {
				var flag = 0;
				var nodeName = projectNodes[proId][i].split("-")[0];
				if (nodeName == key) {
					nodeLengend["number"] += 1;
				}
			}
		}
		legendArr.push(nodeLengend);
	}	
	
	d3.selectAll("#legendSvg").remove();
	var margin = {top: 30, right: 10, bottom: 10, left: 70},
		width = 1500 - margin.left - margin.right,
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
		.base(10).domain([0.5, d3.max(legendArr, function (d) {return Number(d.number);})])
		.range([height, 0]);

	x.domain(legendArr.map(function (d) {return d.name;}));
	let yAxisGenerator = d3.axisLeft(y);
	yAxisGenerator.ticks(5, ".3");
	
	g.append("g")
		.attr("transform", "translate(0," + (-30) + ")")
		.call(yAxisGenerator);

	let xAxisGenerator = d3.axisBottom(x);
	g.append("g")
		.attr("transform", "translate(0," + (height-30) + ")")
		.call(xAxisGenerator)
		.selectAll("text")
		.attr("fill", "#ffffff");

	var barG = g.append("g")
		.attr("transform", "translate(" + 0 + "," + (-30) + ")");
	barG.selectAll(".typeBar")
		.data(legendArr)
		.enter()
		.append("rect")
			.attr("class", "typeBar")
			.attr("x", d => x(d.name))
			.attr("y", d => (y(d.number) || 0))
			.attr("width", x.bandwidth())
			.attr("height", function(d) {
				var he = y(Number(d.number));
				if (Number.isNaN(he)) {
					return 0;
				} else {
					return height - he;
				}
				
			})
			.attr("fill", d => d.color)
			.on("click", function (d, i) {
				click_3(d.name.replace(" ", "_"), nodesData, projectNodes);
			});

	for (var ind=0; ind<legendArr.length; ind++) {
		var leName = legendArr[ind]['name'];
		var leNum = legendArr[ind]["number"];
		if (leNum == 0) {
			var leC = legendArr[ind]['color'].replace("0.65", "0.15");
		} else {
			var leC = legendArr[ind]['color'];
		}
		
		g.append("rect")
			.attr("id", "leName-"+leName)
			.attr("class", "typeBar")
			.attr("x", x(leName))
			.attr("y", height-20)
			.attr("width", x.bandwidth()+5)
			.attr("height", 40)
			.attr("fill", leC)
			.on("click", function() {
				click_3(this.id.split("-")[1].replace(" ", "_"), nodesData, projectNodes);
			});

		g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", height)
		.attr("x", x(leName)+40)
		.text(leName)
			.attr("font-family", "sans-serif")
			.attr("font-size", "14px")
			.attr("font-weight", "100")
			.attr("fill", "#ffffff");

		g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", y(leNum))
		.attr("x", x(leName) + x.bandwidth()/2)
		.text(leNum)
			.attr("font-family", "sans-serif")
			.attr("font-size", "16px")
			.attr("font-weight", "100")
			.attr("fill", "#ffffff");
	}
}