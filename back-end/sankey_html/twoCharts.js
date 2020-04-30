var genLayerChart = function(layerData) {
	var svgLayers = d3.select("#numLayers"),

	margin = {
		top: 30,
		right: 5,
		bottom: 10,
		left: 30
	},
	width = 380 - margin.left - margin.right,
	height = 320 - margin.top - margin.bottom,
	
	g = svgLayers.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

	data = [];

	for (var i=0; i<layerData.length; i++) {
		data.push({"proName": "Pro"+i, "value": layerData[i].length, 'node': layerData[i]});			
	}

	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	x.domain(data.map(function (d) {
			return d.proName;
		}));
	y.domain([0, d3.max(data, function (d) {
				return Number(d.value);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.selectAll("text")
		.attr("y", 0)
    	.attr("x", 9)
    	.attr("dy", ".35em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");

	g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "#000")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
	.text("Number of Layers");

	g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("fill", "steelblue")
	.attr("x", function (d) {
		return x(d.proName);
	})
	.attr("y", function (d) {
		return y(Number(d.value));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.value));
	})
	.on("click", function(d) {click_5(d.node, d.proName)});

	g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", -10)
		.attr("x", width/2)
		.text("Number of Layers in Each Project")
		.attr("font-size","15px")
		.style("fill", "black")
}

var genTypeChart = function(typeData, colorDic, proj) {
	var svgTypes = d3.select("#numTypes"),

	margin = {
		top: 30,
		right: 5,
		bottom: 50,
		left: 30
	},
	width = 380 - margin.left - margin.right,
	height = 320 - margin.top - margin.bottom,
	
	g = svgTypes.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

	data = [];
	
	for (var i=0; i<typeData.length; i++) {
		for (var j=0; j<typeData[i].length; j++) {
			var flag = 0;
			var typeName = typeData[i][j].split('-')[0];
			for (var k=0; k<data.length; k++) {
				if (data[k]['typeName'] == typeName) {
					data[k]['value'] += 1;
					flag = 1;
					break;
				}
			}
			if (flag == 0) {
				for (const key in colorDic) {
					for (const name in colorDic[key]) {
						if (name == typeName) {
							data.push({"typeName": typeName, "value": 1, 'c': colorDic[key][name]});
						}
					}
				}				
			}
		}		
	};



	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	x.domain(data.map(function (d) {
			return d.typeName;
		}));
	y.domain([0, d3.max(data, function (d) {
				return Number(d.value);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.selectAll("text")
		.attr("y", 0)
    	.attr("x", 9)
    	.attr("dy", ".35em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");

	g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Number of Types of Layers");

	g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function (d) {
		return x(d.typeName);
	})
	.attr("y", function (d) {
		return y(Number(d.value));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.value));
	})
	.attr("fill", function (d) { return d.c})
	.on("click", function (d, i) {
          click_3(d.typeName, proj.nodes);
        });

	g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", -10)
		.attr("x", width/2)
		.text("Number of Type of Layers in all Project")
		.attr("font-size","15px")
		.style("fill", "black")
}