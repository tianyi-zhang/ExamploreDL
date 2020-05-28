var getHistoData = function(data) {
	var [ min, max ] = d3.extent(Object.values(data).map(d => +d));

	const dataLength = Object.keys(data).length;
	var divideNum = 20;
	var key = data[0];
	var targetDict = {};
	
	if (min == max) {
		var oneValue = min;
		min = oneValue-0.1;
		max = oneValue+0.1;
	}
	var divideSpace = (max-min)/divideNum;

	for (const key in data) {
		var dataValue = data[key];
		for (var j=0; j<divideNum; j++) {
			var below = min+j*divideSpace;
			var above = min+(j+1)*divideSpace;

			if (below <= dataValue && dataValue < above) {

				if (below in targetDict) {
					targetDict[below] += 1;
				} else {
					targetDict[below] = 1;
				}
			}
		}		
	}
	
	var rangeLi = [];
	for (var k=0; k<divideNum; k++) {
		rangeLi.push(min+k*divideSpace);
	}

	return [targetDict, rangeLi, divideNum, divideSpace];
}

var histogramSlider = function(svgId, data, allData, filterData) {

	var [histogram, range, divideNum, divideSpace] = getHistoData(data);

	const defaultOptions = {
		'w': 400,
		'h': 150,
		'margin': {
			top: 20,
			bottom: 20,
			left: 30,
			right: 30,
		},
		bucketSize: 1,
		defaultRange: [0, 100],
		format: d3.format('.3s'),
	};
	
	const [ min, max ] = d3.extent(Object.keys(histogram).map(d => +d));

	const [ ymin, ymax ] = d3.extent(Object.values(histogram).map(d => +d));

	// set width and height of svg
	const { w, h, margin, defaultRange, bucketSize, format } = {...defaultOptions};

	// dimensions of slider bar
	const width = w - margin.left - margin.right;
	const height = h - margin.top - margin.bottom;

	// create x scale
	const x = d3.scaleLinear()
		.domain([ min, max+divideSpace])	// data space
		.range([0, width]);	// display space

	const y = d3.scaleLinear()
		.domain([0, d3.max(Object.values(histogram))])
		.range([0, height]);
	
	// create svg and translated g
	var svg = d3.select("#"+svgId)
		.attr("width", w)
		.attr("height", h);

	const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

 // draw histogram values
	g.append("g")
		.attr("class", svgId+"-slider-xaxis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)
			.ticks(9)
			.tickFormat(d3.format(".2")))
		.selectAll("text")
			.attr("font-family", "sans-serif")
			.attr("font-size", "12px")
			.attr("font-weight", "100")
			.attr("fill", "#505050")
			.style("text-anchor", "middle");

	g.append('g').selectAll('rect')
		.data(range)
		.enter()
		.append('rect')
		.attr("class", svgId+"-slider-rect")
		.attr('x', d => x(d))
		.attr('y', d => height - y(histogram[d] || 0))
		.attr('width', width / divideNum)
		.attr('height', d => y(histogram[d] || 0)) //d => y(histogram[d] || 0))
		.style('fill', '#7096FF');

	for (const key in histogram) {
		svg.append("text")
			.attr("class", svgId+"-slider-text")
			.attr("text-anchor", "start")
			.attr("y", height - y(histogram[key]) + 35)
			.attr("x", (x(key)+margin.left+5))
			.text(histogram[key])
				.style("font-family", "sans-serif")
				.attr("font-size","12px")
				.attr("font-weight", 100)
				.style("fill", "white")
	}
 
	// define brush
	var brush = d3.brushX()
		.extent([[0, 0], [width, height]])
		.on("brush", brushnow)
		.on("end", brushmoved);
	
	// append brush to g
	var gBrush = g.append("g")
			.attr("class", svgId+"-brush")
			.call(brush);

	// add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
	var brushResizePath = function(d) {
		var e = +(d.type == "e"),
			x = e ? 1 : -1,
			y = height / 2;
		return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
}

	var handle = gBrush.selectAll(".handle--custom")
		.data([{type: "w"}, {type: "e"}])
		.enter().append("path")
		.attr("class", svgId+"-handle--custom")
		.attr("stroke", "#000")
		.attr("cursor", "ew-resize")
		.attr("d", brushResizePath);

	var count = 0;
	gBrush.call(brush.move, [min, max+divideSpace].map(x));
	count = 1;

	function brushnow() {
		var s = d3.event.selection;
		handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
	}

	function brushmoved() {
		var s = d3.event.selection;
		var sx = s.map(x.invert);
		handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
		if (count!==0) {
			moveProcess(sx, data, svgId, allData, filterData);
		}			
	}

	return svg.node();
}

function moveProcess(sx, data, svgId, allData, filterData) {

	var svgIdList = ['accSvg', 'nopSvg'];
	var idList = [];
	for (const key in data) {
		if (sx[0] <= data[key] && data[key] <= sx[1]) {
			idList.push(key);
		}
	}
	updateFilterSVG(filterData, idList, '');
	mainDraw(idList);
	for (var i=0; i<svgIdList.length; i++) {
		if (svgId !== svgIdList[i]) {
			updateSlider(svgIdList[i], allData, idList, filterData);
		}
	}
}

function updateSlider(svgId, data, idList, filterData) {

	d3.selectAll("."+svgId+"-slider-xaxis").remove();
	d3.selectAll("."+svgId+"-slider-rect").remove();
	d3.selectAll("."+svgId+"-slider-text").remove();
	d3.selectAll("."+svgId+"-brush").remove();
	d3.selectAll("."+svgId+"-handle--custom").remove();

	var dict = {};
	if (svgId=="accSvg") {
		for (var i=0; i<idList.length; i++) {
			dict[data[idList[i]]['ID']] = data[idList[i]]["Accuracy"];
		}
	} else if (svgId=="nopSvg") {
		for (var i=0; i<idList.length; i++) {
			dict[data[idList[i]]['ID']] = data[idList[i]]["Num_Parameters"];
		}
	}
	console.log('updata',data, dict);
	histogramSlider(svgId, dict, data, filterData);
}