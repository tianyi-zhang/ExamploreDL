function classifyRecords(data, tarStr, tarDict) {
				
	var tar = data[tarStr];
	if (tarStr=="Models") {
		tar = tar.split("-")[0];
	}
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

let dictSort = (dict) => {
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

	var sortedKey = dictSort(dict);
	
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
		label.style.fontSize = "18px";
		label.appendChild(document.createTextNode(words));

		newCell.appendChild(checkbox);
		newCell.appendChild(label);

		var newSVGDiv = document.createElement('div');
		newSVGDivId = boxClassName+"-"+key.replace("!", "");
		newSVGDivId = newSVGDivId.replaceAll(" ", "_");
		newSVGDiv.id = newSVGDivId;
		newCellSVGTd.appendChild(newSVGDiv);
		
		var barLength = (dict[key].length/maxLength)*150;
		createFilterSvg(barLength, newSVGDivId, dict[key].length);
		pos += 1;
	}
	return pos;
}		
	
function readCSVFile(file)
{
	
	var finalOut = d3.csv(file)
		.then(function(data) {
			var taskDict = {},
				modelDict = {},
				datasetDict = {},
				starsDict = {},
				forksDict = {};
			for (var i=0; i<data.length; i++) {
				starsDict[data[i]['ID']] = data[i]["Stars"];
				forksDict[data[i]['ID']] = data[i]["Forks"];
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

			histogramSlider('starsSvg', starsDict, data);
			histogramSlider('forksSvg', forksDict, data);
			
			return [outData, data];
		})
	return finalOut;
	
}