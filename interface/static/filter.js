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
		if (newKey !== thisClassName) {
			for (const element in newData[newKey]) {
				var barLength = (newData[newKey][element].length/maxLengthLi[newKey])*150;
				newSVGDivId = newKey+"-"+element.replace("!", "");
				newSVGDivId = newSVGDivId.replaceAll(" ", "_")
				changeFilterSvg(barLength, newSVGDivId, newData[newKey][element].length);
			}
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