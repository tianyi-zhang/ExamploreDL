function genInfo(idList, nodesData, hyper) {
	const myNode = document.getElementById("GitHub-info-div");
	while (myNode.lastElementChild) {
		myNode.removeChild(myNode.lastElementChild);
	}

	var keyList = ["Tasks", "Datasets", "Stars", "Forks"];

	proData = {};
	for (var i=0; i<idList.length; i++) {
		var proid = idList[i];
		var proName = csvData[proid]['Project_Name'].replaceAll("_", "-");
		if (Object.keys(proData).includes(proName)) {
			proData[proName]['Models'].push(csvData[proid]['Models']);
			proData[proName]["id"].push(proid);
			proData[proName]["nodes"].push(nodesData[proid]);
		} else {
			proData[proName] = {"Models": [csvData[proid]['Models']], "id": [proid], "nodes": [nodesData[proid]]};
			proData[proName]["Tasks"] = csvData[proid]["Tasks"];
			proData[proName]["URL"] = csvData[proid]["URL"];
			proData[proName]["Datasets"] = csvData[proid]["Datasets"];
			proData[proName]["Stars"] = csvData[proid]["Stars"];
			proData[proName]["Forks"] = csvData[proid]["Forks"];
		}
	}

	for (const key in proData) {
		createNewDiv(myNode, key, keyList, proData[key], hyper, proData);	
		
	}
}

function createNewDiv(parentNode, proName, keyList, record, hyper, proData) {

	var newProjectDiv = document.createElement("div");
	newProjectDiv.setAttribute("id", "info-"+proName);
	newProjectDiv.setAttribute("class", "newProjectDiv");
	parentNode.appendChild(newProjectDiv);

	var projectInfoDiv = document.createElement("div");
	projectInfoDiv.setAttribute("id", "proInfo-"+proName);
	projectInfoDiv.setAttribute("class", "projectInfoDiv");

	var keyText = document.createTextNode("Project_Name: ");
	projectInfoDiv.appendChild(keyText);
	var a = document.createElement("a");
	a.setAttribute("href", record["URL"]);
	var text = document.createTextNode(proName);
	a.appendChild(text);
	projectInfoDiv.appendChild(a);
	var headbr = document.createElement("br");
	projectInfoDiv.appendChild(headbr);

	for (var i=0; i<keyList.length; i++) {

		var key = keyList[i];
		var value = record[key];

		textContent = key + ": " + value;
		var text = document.createTextNode(textContent);			
		projectInfoDiv.appendChild(text);
		var newbr = document.createElement("br");
		projectInfoDiv.appendChild(newbr);
	}
	newProjectDiv.appendChild(projectInfoDiv);

	for (var j=0; j<record["id"].length; j++) {
		var newModelDiv = document.createElement("div");
		newModelDiv.setAttribute("id", proName+"_"+record["id"][j]);
		newModelDiv.setAttribute("class", "newModelDiv");
		var text = document.createTextNode(record["Models"][j]);
		newModelDiv.appendChild(text);
		newProjectDiv.appendChild(newModelDiv);
		document.getElementById(proName+"_"+record["id"][j]).addEventListener("click", function() {
			
			if (this.style.backgroundColor == "#8D85EE" || this.style.backgroundColor == "rgb(141, 133, 238)") {
				this.style.background = "#B3B3B3";
			} else {
				this.style.background = "#8D85EE";
			}

			hyperparameterChart(hyper, this.id.split("_")[1]);
			d3.selectAll(".bar").attr("fill", "#BBB5F0");
			//d3.select("#layerRect"+record["nodes"][ind].length).attr("fill", "#8D85EE");
			var svg = d3.select('#chart');

			var parent = document.getElementById('GitHub-info-div'),
				child = parent.getElementsByClassName("newProjectDiv"),
				childLi = Array.prototype.slice.call(child, 0),
				safeLi = [];
			for (var k=0; k<childLi.length; k++) {
				var boxId = childLi[k].id,
					grandChild = document.getElementById(boxId).getElementsByClassName("newModelDiv"),
					grandChildLi = Array.prototype.slice.call(grandChild, 0);
				for (var l=0; l<grandChildLi.length; l++) {
					var modelId = grandChildLi[l].id,
						realName = modelId.split("_")[0],
						thisBox = document.getElementById(modelId);
					if (thisBox.style.backgroundColor == "#8D85EE" || thisBox.style.backgroundColor == "rgb(141, 133, 238)") {
						var flag = 1;
					} else {
						var flag = 0.35;
					}
					var ind = 0;
					for (var n=0; n<proData[realName]["id"].length; n++) {
						if (proData[realName]["id"][n] == modelId.split("_")[1]) {
							ind = n;
						}
					}
					for (var m=0; m<proData[realName]["nodes"][ind].length; m++) {
						var findId = proData[realName]["nodes"][ind][m].replace(" ", "_");
						if (!safeLi.includes(findId)){
							svg.selectAll("#"+findId).style("opacity", flag);
							svg.selectAll("#path"+findId).style("opacity", flag);
							if (flag==1) {
								safeLi.push(proData[realName]["nodes"][ind][m].replace(" ", "_"));
							}
						}
					}
				}
			}		
		});
	}	

	document.getElementById("proInfo-"+proName).addEventListener("click", clickDiv);
	
	function clickDiv() {
		d3.selectAll(".bar").attr("fill", "#BBB5F0");
		var svg = d3.select('#chart');
		svg.selectAll("path").style("opacity", 0.35);
		svg.selectAll("rect").style("opacity", 0.35);
		svg.selectAll("rect").attr("stroke", "#ffffff");
		for (var k=0; k<record["nodes"].length; k++) {
			d3.select("#layerRect"+record["nodes"][k].length).attr("fill", "#8D85EE");
			for (var l=0; l<record["nodes"][k].length; l++) {
				svg.selectAll("#"+record["nodes"][k][l].replace(" ", "_")).style("opacity", 1);
				svg.selectAll("#path"+record["nodes"][k][l].replace(" ", "_")).style("opacity", 1);
			}
		}
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