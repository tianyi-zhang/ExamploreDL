function genInfo(idList, nodesData) {

	const myNode = document.getElementById("GitHub-info-div");
	while (myNode.lastElementChild) {
		myNode.removeChild(myNode.lastElementChild);
	}

	var keyList = ["Project_Name", "Tasks", "Datasets", "Models", "Stars", "Forks"];

	for (var k=0; k<csvData.length; k++) {
		if (idList.includes(k+"")) {
			createNewDiv(myNode, keyList, csvData[k], nodesData[k+""], ""+k);	
		}
	}
}

function createNewDiv(parentNode, keyList, record, nodeList, projectId) {

	var newProjectDiv = document.createElement("div");
	newProjectDiv.setAttribute("id", "info-"+projectId);
	newProjectDiv.setAttribute("class", "newProjectDiv");
	newProjectDiv.setAttribute("style", "background-color: #B3B3B3;");

	for (var j=0; j<keyList.length; j++) {

		var key = keyList[j];
		var value = record[key];
		if (key == "Project_Name") {
			var keyText = document.createTextNode(key+": ");
			newProjectDiv.appendChild(keyText);
			var a = document.createElement("a");
			a.setAttribute("href", record["URL"]);
			var text = document.createTextNode(value);
			a.appendChild(text);
			newProjectDiv.appendChild(a);
		} else {
			textContent = key + ": " + value;
			var text = document.createTextNode(textContent);			
			newProjectDiv.appendChild(text);
		}
		var br = document.createElement("br");
		newProjectDiv.appendChild(br);
		parentNode.appendChild(newProjectDiv);
	}

	document.getElementById("info-"+projectId).addEventListener("click", clickDiv);
	
	function clickDiv() {
		d3.selectAll(".bar").attr("fill", "#BBB5F0");
		d3.select("#layerRect"+nodeList.length).attr("fill", "#8D85EE");
		
		var svg = d3.select('#chart');
		
		svg.selectAll("path").style("opacity", 0.35);
		svg.selectAll("rect").style("opacity", 0.35);
		svg.selectAll("rect").attr("stroke", "#ffffff");
		var all_th = d3.selectAll('.svg_th_tr')
			.style("border-top", "1px solid #848484")
			.style("border-right", "1px solid #848484")
			.style("border-left", "1px solid #848484")
			.style("border-bottom", "none")
			.style("border-collapse", "collapse");
		d3.selectAll('.svg_tb_td').style("border", "none");
		for (var l=0; l<nodeList.length; l++) {
			svg.selectAll("#"+nodeList[l].replace(" ", "_")).style("opacity", 1);
			svg.selectAll("#path"+nodeList[l].replace(" ", "_")).style("opacity", 1);
		}
	}
}

function hightlightInfo(proIdList) {
	d3.selectAll(".newProjectDiv").style("opacity", 1);
	var parent = document.getElementById("GitHub-info-div");
	var childLi = parent.getElementsByClassName("newProjectDiv");
	childLi = Array.prototype.slice.call(childLi, 0);
	while (parent.lastElementChild) {
		parent.removeChild(parent.lastElementChild);
	}

	var unvisableDivLi = [];

	for (var j=0; j<childLi.length; j++) {
		var childId = childLi[j].id;

		var flag = 0;
		for (var k=0; k<proIdList.length; k++) {
			if ("info-"+proIdList[k] == childId) {
				flag = 1;

				parent.appendChild(childLi[j]);
				break;
			}
		}
		if (flag == 0) {
			unvisableDivLi.push(childLi[j]);
		}
	}
	for (var l=0; l<unvisableDivLi.length; l++) {
		parent.appendChild(unvisableDivLi[l]);
		var removeEle = d3.selectAll("#"+unvisableDivLi[l].id);
			removeEle.style("opacity", 0);
	}
}

sortByfunction = function(selectObject) {
	var value = selectObject.value;	
	if (value !== "None" && value) {
		var parent = document.getElementById('GitHub-info-div')
		var allSort = parent.getElementsByClassName("newProjectDiv");
		var allSortLi = Array.prototype.slice.call(allSort, 0);
		var toSort = [];
		var unvisableLi = [];

		for (var i=0; i<allSortLi.length; i++) {
			var em = document.getElementById(""+allSortLi[i].id);
			var temp = window.getComputedStyle(em).getPropertyValue("opacity");

			if (temp == 1) {
				toSort.push(allSortLi[i]);
			} else {
				unvisableLi.push(allSortLi[i]);
			}
		}

		if (value == "Stars") {
			toSort.sort(function(a, b) {
				var aord = +a.textContent.split('Stars: ')[1].split("Forks: ")[0];
				var bord = +b.textContent.split('Stars: ')[1].split("Forks: ")[0];
				return bord - aord;
			});
		} else if (value == "Forks") {
			toSort.sort(function(a, b) {
				var aord = +a.textContent.split('Stars: ')[1].split("Forks: ")[1];
				var bord = +b.textContent.split('Stars: ')[1].split("Forks: ")[1];
				return bord - aord;
			});
		}

		while (parent.lastElementChild) {
			parent.removeChild(parent.lastElementChild);
		}

		for (var j = 0; j < toSort.length; j++) {
			parent.appendChild(toSort[j]);
		}
		for (var k = 0; k < unvisableLi.length; k++) {
			parent.appendChild(unvisableLi[k]);
		}
	}
}