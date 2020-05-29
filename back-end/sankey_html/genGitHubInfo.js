function genInfo(data, idList, nodesData) {

	const myNode = document.getElementById("GitHub-info-div");
	while (myNode.lastElementChild) {
		myNode.removeChild(myNode.lastElementChild);
	}

	var keyList = ["Project_Name", "Tasks", "Datasets", "Models", "Accuracy", "Num_Parameters"];

	for (var k=0; k<data.length; k++) {
		if (idList.includes(k+"")) {
			createNewDiv(myNode, keyList, data[k], nodesData[k+""], ""+k);	
		}
	}
}

function createNewDiv(parentNode, keyList, record, nodeList, projectId) {

	var newProjectDiv = document.createElement("div");
	newProjectDiv.setAttribute("id", "info-"+projectId);
	newProjectDiv.setAttribute("class", "newProjectDiv");
	newProjectDiv.setAttribute("style", "background-color: F5F4F2;");

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
		d3.selectAll(".bar").attr("fill", "steelblue");
		d3.select("#layerRect"+nodeList.length).attr("fill", "#fca311");
		d3.selectAll(".newProjectDiv").attr("style", "background-color: #8d99ae;");
		d3.select("#"+"info-"+projectId).attr("style", "background-color: #DB0045;");
		var recordArgs = [nodeList, projectId];
		var svg = d3.select('#chart');
		addRecord("Git", projectId+" project", {"click_6": recordArgs});
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
			svg.selectAll("#"+nodeList[l]).style("opacity", 1);
			svg.selectAll("#path"+nodeList[l]).style("opacity", 1);
		}
	}
}