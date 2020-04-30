var newData = function(x0, x1, nodeData, nowKey, selected_cat) {

	var newNodeData = [];
	var hightlightNodes = [];
	for (i=0; i<nodeData.length; i++) {
		var nodeArgs = nodeData[i]["args"];
		if ((nodeData[i]["category"] == selected_cat) && (Object.keys(nodeArgs).includes(nowKey))) {
			var dataValue = nodeArgs[nowKey];
			for (j=0; j<dataValue.length; j++) {
				if ((x0 <= dataValue[j]) && (dataValue[j] < x1)) {
					newNodeData.push(nodeData[i]);
					hightlightNodes.push(nodeData[i].name);
					break;
				}
			}
		}
	}
	click_4(x0, x1, nowKey, hightlightNodes, selected_cat, newNodeData);
}

var recordArgList = []; 
var addRecord = function(textContent, func) {
	recordArgList.push(func);

	var childcount = document.getElementById("record")
		.getElementsByClassName("record_text")
		.length;
	
	var paragraph = document.getElementById("record");

	var tag = document.createElement("p");
	tag.setAttribute("id", "record-" + childcount);
	tag.setAttribute("class", "record_text");
	tag.setAttribute("style", "font-size:12px;");
	var text = document.createTextNode(textContent);
	tag.appendChild(text);

	paragraph.appendChild(tag);

	document.getElementById("record-" + childcount).addEventListener("click", myFunction);

	function myFunction() {
		
  		var funcName = Object.keys(recordArgList[childcount])[0];
  		var args = recordArgList[childcount][funcName];

  		var NewChildcount = document.getElementById("record")
				.getElementsByClassName("record_text")
				.length;

		for (var i=NewChildcount-1; i>=childcount; i--) {
			var myobj = document.getElementById("record-" + i);
			myobj.remove();
			recordArgList.splice(i, 1);
		}
  		if (funcName == "click_1") {
  			click_1(...args);
  		} else if (funcName == "click_2") {
  			click_2(...args);
  		} else if (funcName == "click_3") {
  			click_3(...args);
  		} else if (funcName == "click_4") {
  			click_4(...args);
  		} else if (funcName == "click_5") {
  			click_5(...args);
  		}
	}
}