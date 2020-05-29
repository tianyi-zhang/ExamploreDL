var recordArgList = []; 
var addRecord = function(colorKey, textContent, func) {
	var colorDict = {"Picked": "#00154D", "Selected": "#FCDAA5", "Project Length": "#fca311", "Git": "#DB0045"};
	var addColor = colorDict[colorKey];

	recordArgList.push(func);

	var childcount = document.getElementById("record")
		.getElementsByClassName("breadcrumbDiv")
		.length;
	
	var paragraph = document.getElementById("record");

	var breadcrumbDiv = document.createElement("div");
	breadcrumbDiv.setAttribute("id", "bc-"+childcount);
	breadcrumbDiv.setAttribute("class", "breadcrumbDiv");
	breadcrumbDiv.setAttribute("style", "background-color: "+addColor+";");

	var text = document.createTextNode(textContent);
	breadcrumbDiv.appendChild(text);

	paragraph.appendChild(breadcrumbDiv);

	document.getElementById("bc-" + childcount).addEventListener("click", myFunction);
	
	function myFunction() {
		
		var funcName = Object.keys(recordArgList[childcount])[0];
		var args = recordArgList[childcount][funcName];

		var NewChildcount = document.getElementById("record")
				.getElementsByClassName("breadcrumbDiv")
				.length;

		for (var i=NewChildcount-1; i>=childcount; i--) {
			var mydiv = document.getElementById("bc-"+i);
			mydiv.remove();
			recordArgList.splice(i, 1);
		}
		if (funcName == "click_1") {
			click_1(...args);
		} else if (funcName == "click_2") {
			click_2(...args);
		} else if (funcName == "click_3") {
			click_3(...args);
		} else if (funcName == "click_5") {
			click_5(...args);
		} else if (funcName == "click_6") {
			click_6(...args);
		}
	}
}