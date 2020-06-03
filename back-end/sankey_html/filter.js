function updateFilterSVG(idList, thisClassName) {

	var newData = {"datasetsTr":{}, "tasksTr":{}, "modelsTr":{}};
	var maxLengthLi = {"datasetsTr":0, "tasksTr":0, "modelsTr":0};
	for (const key in filterData) {
		var maxLength = 0;
		for (const insideKey in filterData[key]) {

			var insideList = [];
			for (var i=0; i<filterData[key][insideKey].length; i++) {

				if (idList.includes(filterData[key][insideKey][i])) {
					insideList.push(filterData[key][insideKey][i]);
				}
			}
			newData[key][insideKey] = insideList;

			if (filterData[key][insideKey].length>maxLength) {
				maxLength = filterData[key][insideKey].length;
			}
		}
		maxLengthLi[key] = maxLength;
	}
	for (const newKey in newData) {
		
		for (const element in newData[newKey]) {
			var barLength = (newData[newKey][element].length/maxLengthLi[newKey])*150;
			if (element.indexOf('_') >= 0) {
				newSVGDivId = newKey+"-"+element.split("_")[0].slice(0, 3) + element.split("_")[1].slice(0, 3);
			} else {
				newSVGDivId = newKey+"-"+element.slice(0, 3);
			} 
			changeFilterSvg(barLength, newSVGDivId, newData[newKey][element].length);
		}
		
	}
}

function changeFilterSvg(barLength, filterDivId, num) {
	var svg_id = filterDivId + '-svg';

	var svg = d3.select("#"+svg_id)

	d3.select("#"+svg_id+"-rect").remove();

	var oriRect = d3.select("#"+svg_id+"-oriRect")
		.style("opacity", 0.45)

	var rectSvg = svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("id", svg_id+"-rect")
		.attr("width", barLength)
		.attr("height", 20)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr('fill', '#8D85EE');
}

var genLayerChart = function(proNode) {

	d3.selectAll("#numLayersSvg").remove();
	

	var svgLayers = d3.select("#numLayers").append("svg")
		.attr("width", '415')
		.attr("height", '350')
		.attr("id", "numLayersSvg");

	var margin = {
		top: 30,
		right: 5,
		bottom: 10,
		left: 30
	},
	width = 380 - margin.left - margin.right,
	height = 320 - margin.top - margin.bottom,
	
	g = svgLayers.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

	data = [];

	var keyLi = Object.keys(proNode);

	for (var i=0; i<keyLi.length; i++) {
		var flag = 0;
		var layerLength = proNode[keyLi[i]].length;
		
		for (var j=0; j<data.length; j++) {
			if (data[j]['layerNum'] == layerLength) {
				data[j]['value'] += 1;
				data[j]['layerNodes'] = [...data[j]['layerNodes'], ...proNode[keyLi[i]]];
				data[j]["projectId"].push(keyLi[i]);
				flag = 1;
				break;
			}
		}

		if (flag==0) {
			data.push({"layerNum": layerLength, 'value': 1, 'layerNodes': proNode[keyLi[i]], "projectId": [keyLi[i]]});
		}		
	}				
	
	data = bubbleSort(data, "layerNum");

	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	x.domain(data.map(function (d) {
			return d.layerNum;
		}));
	y.domain([0, d3.max(data, function (d) {
				return Number(d.value);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.selectAll("text")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("font-weight", "100")
		.attr("fill", "#505050")
		.style("text-anchor", "middle");

	g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("id", function(d) {return "layerRect"+d.layerNum ;})
	.attr("class", "bar")
	.attr("fill", "#BBB5F0")
	.attr("x", function (d) {
		return x(d.layerNum);
	})
	.attr("y", function (d) {
		return y(Number(d.value));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.value));
	})
	.on("click", function(d) {
		var proIdList = [];
		for (const key in proNode) {
			if (proNode[key].length == d.layerNum) {
				proIdList.push(key);
			}
		};
		click_5(d.layerNodes, d.layerNum, proIdList);
	});

	g.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency")
			.attr("font-family", "sans-serif")
			.attr("font-size", "12px")
			.attr("font-weight", "100")
			.attr("fill", "#505050");

	g.append("text")
		.attr("text-anchor", "middle")
		.attr("y", -10)
		.attr("x", width/2)
		.text("Number of Layers in Each Project")
			.attr("font-family", "sans-serif")
			.attr("font-size", "15px")
			.attr("font-weight", "100")
			.attr("fill", "#505050");
}