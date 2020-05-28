function classifyRecords(data, tarStr, tarDict) {
				
	var tar = data[tarStr];
	if ((typeof tar)=='string' && tar.includes(', ')) {
		var tarLi = tar.split(', ');
	} else {
		var tarLi = [tar];
	}
	for (var j=0; j<tarLi.length; j++) {
		var tarName = tarLi[j].replace(/_/gi, "_");
		if (Object.keys(tarDict).includes(tarName)) {
			tarDict[tarName].push(data['ID']);
		} else {
			tarDict[tarName] = [data['ID']];
		}
	}
	return tarDict;
}

function createFilterSvg(barLength, filterDivId, num) {
	var svg_id = filterDivId + '-svg';

	d3.select("#"+svg_id).remove();

	var svg = d3.select('#'+filterDivId).append("svg")
		.attr("width", '180')
		.attr("height", '22')
		.attr("id", svg_id);

	var rectSvg = svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr('id', svg_id+"-oriRect")
		.attr("width", barLength)
		.attr("height", 20)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr('fill', '#8D85EE');

	svg.append("text")
	    .attr("x", barLength+5)
	    .attr("y", 12.5)
	    .attr("id", svg_id+"-oriText")
	    .attr("dy", ".35em")
	    .text(''+num);
}

let bubbleSort = (dict) => {
	var inputArr = Object.keys(dict);

	let len = inputArr.length;
	let swapped;
	do {
		swapped = false;
		for (let i = 0; i < len-1; i++) {
			if (dict[inputArr[i]].length < dict[inputArr[i+1]].length) {
				let tmp = inputArr[i];
				inputArr[i] = inputArr[i + 1];
				inputArr[i + 1] = tmp;
				swapped = true;
			}
		}
	} while (swapped);
	return inputArr;
};

function createCell(dict, tableTar, pos, boxClassName) {

	var maxLength = 0;
	var keyLi = [];

	for (var key in dict) {
		if (dict[key].length > maxLength) {
			maxLength = dict[key].length;
		}
	}

	var sortedKey = bubbleSort(dict);
	
	for (var l=0; l<sortedKey.length; l++) {
		let newRow = tableTar.insertRow(pos); 
		let newCell = newRow.insertCell(0);
		newCell.style.width = '220px';
		newCell.style.height = '20px';
		let newCellSVGTd = newRow.insertCell(1);
		newCellSVGTd.style.width = '200px';
		var key = sortedKey[l];
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.value = dict[key];
		checkbox.id = "myCheckbox";
		checkbox.className = boxClassName;
		checkbox.checked = false;

		var label = document.createElement('label')
		label.htmlFor = "id";
		var words = key.replace(/_/gi, " ");
		
		label.appendChild(document.createTextNode(words));

		newCell.appendChild(checkbox);
		newCell.appendChild(label);

		var newSVGDiv = document.createElement('div');
		if (key.indexOf('_') >= 0) {
			newSVGDivId = boxClassName+"-"+key.split("_")[0].slice(0, 3) + key.split("_")[1].slice(0, 3);
		} else {
			newSVGDivId = boxClassName+"-"+key.slice(0, 3);
		}
		newSVGDiv.id = newSVGDivId;
		newCellSVGTd.appendChild(newSVGDiv);
		
		var barLength = (dict[key].length/maxLength)*150;
		createFilterSvg(barLength, newSVGDivId, dict[key].length);
		pos += 1;
	}
	return pos;
}		
	
function readTextFile(file)
{
	
	var finalOut = d3.csv(file)
		.then(function(data) {
			var taskDict = {},
				modelDict = {},
				datasetDict = {},
				accDict = {},
				numParaDict = {};
		
			for (var i=0; i<data.length; i++) {
				accDict[data[i]['ID']] = data[i]["Accuracy"];
				numParaDict[data[i]['ID']] = data[i]["Num_Parameters"];
				taskDict = classifyRecords(data[i], 'Tasks', taskDict);
				modelDict = classifyRecords(data[i], 'Models', modelDict);
				datasetDict = classifyRecords(data[i], 'Datasets', datasetDict);
			}
			
			var outData = {"datasetsTr":datasetDict, "tasksTr":taskDict, "modelsTr":modelDict};
			var tableTar = document.getElementById("filterTable");
			let dTr = document.getElementById("datasetsTr");
			pos = createCell(datasetDict, tableTar, 1, 'datasetsTr');
			let tTr = document.getElementById("tasksTr");
			pos = createCell(taskDict, tableTar, pos+1, 'tasksTr');
			let mTr = document.getElementById("modelsTr");
			pos = createCell(modelDict, tableTar, pos+1, 'modelsTr');

			histogramSlider('accSvg', accDict, data);
			histogramSlider('nopSvg', numParaDict, data);
			
			return [outData, data];
		})
	return finalOut;
	
}

function changeFilterSvg(barLength, filterDivId, num) {
	var svg_id = filterDivId + '-svg';

	var svg = d3.select("#"+svg_id)

	d3.select("#"+svg_id+"-oriText").remove();
	d3.select("#"+svg_id+"-rect").remove();
	d3.select("#"+svg_id+"-text").remove();

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

	svg.append("text")
	    .attr("x", barLength+5)
	    .attr("y", 12.5)
	    .attr("id", svg_id+"-text")
	    .attr("dy", ".35em")
	    .text(''+num);
}

function updateFilterSVG(data, idList, thisClassName) {

	var newData = {"datasetsTr":{}, "tasksTr":{}, "modelsTr":{}};
	var maxLengthLi = {"datasetsTr":0, "tasksTr":0, "modelsTr":0};
	for (const key in data) {
		var maxLength = 0;
		for (const insideKey in data[key]) {
			var insideList = [];
			for (var i=0; i<data[key][insideKey].length; i++) {

				if (idList.includes(data[key][insideKey][i])) {
					insideList.push(data[key][insideKey][i]);
				}
			}
			newData[key][insideKey] = insideList;
			if (insideList.length>maxLength) {
				maxLength = insideList.length;
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