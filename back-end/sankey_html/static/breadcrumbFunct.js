var recordArgList = []; 

function resort() {
	var paragraph = document.getElementById("record");
	var allDiv = paragraph.getElementsByClassName("breadcrumbDiv");
	allDiv = Array.prototype.slice.call(allDiv, 0);
	var bcLength = allDiv.length;
	for (var j=0; j<bcLength; j++) {
		document.getElementById(allDiv[j].id).id = "bc-"+j;
	}
}

var addRecord = function(colorKey, textContent, func) {
	textContent = textContent.replace("_", " ");
	var colorDic = {
			'Convolution': "rgba(54, 69, 133, 0.65)",
			'Max Pooling': "rgba(90, 102, 158, 0.65)",
			'Average Pooling': "rgba(163, 171, 206, 0.65)",
			'LSTM': "rgba(212, 80, 135, 0.65)",
			'GRU': "rgba(249, 93, 106, 0.65)",
			'BiRNN': "rgba(249, 93, 106, 0.65)",
			'Input': "rgba(76, 18, 1, 0.65)",
			'Dense': "rgba(176, 43, 2, 0.65)",
			'Flatten': "rgba(252, 81, 28, 0.65)",
			'Dropout': "rgba(18, 109, 52, 0.65)",
			'Attention': "rgba(152, 231, 49, 0.65)",
			'Cross Entropy': "rgba(65, 39, 89, 0.65)",
			'Optimizer': "rgba(91, 54, 125, 0.65)",					
			'ReLu': "rgba(255, 166, 1, 0.65)",
			'Sigmoid': "rgba(255, 124, 1, 0.65)",
			'Softmax': "rgba(255, 192, 1, 0.65)",
	};
	if (colorKey !== "") {
		var addColor = colorKey;
	} else {
		var addColor = colorDic[textContent];
	}
	
	var paragraph = document.getElementById("record");
	var allDiv = paragraph.getElementsByClassName("breadcrumbDiv");
	allDiv = Array.prototype.slice.call(allDiv, 0);
	var bcLength = allDiv.length;


	if (["click_1", "click_3"].includes(Object.keys(func)[0])) {
		var funcTar = ["click_1", "click_3"];
	} else {
		var funcTar = [Object.keys(func)[0]];
	}
	for (var ind=bcLength-1; ind>=0; ind--) {
		if (funcTar.includes(Object.keys(recordArgList[ind])[0])) {
			
			d3.selectAll("#bc-"+ind).remove();
			recordArgList.splice(ind, 1);
			
		} 
	}
	recordArgList.push(func);
	resort();

	var newDiv = paragraph.getElementsByClassName("breadcrumbDiv");
	newDiv = Array.prototype.slice.call(newDiv, 0);
	var childcount = newDiv.length;

	var breadcrumbDiv = document.createElement("div");
	breadcrumbDiv.setAttribute("id", "bc-"+childcount);
	breadcrumbDiv.setAttribute("class", "breadcrumbDiv");
	breadcrumbDiv.setAttribute("style", "background-color: "+addColor+";");

	var text = document.createTextNode(textContent);
	breadcrumbDiv.appendChild(text);	

	var closeDiv = document.createElement("span")
	closeDiv.id = "bc-"+childcount+"-btn";
	closeDiv.className = "bc-close-btn";
	var closeText = document.createTextNode("X");
	closeDiv.appendChild(closeText);
	breadcrumbDiv.appendChild(closeDiv);

	paragraph.appendChild(breadcrumbDiv);

	d3.selectAll("#bc-" + childcount )
		.on("click", myFunction);

	d3.selectAll("#bc-"+childcount+"-btn")
		.on("click", closeFunc);
	
	function myFunction() {
		
		var thisInd = this.id.split("-")[1];
		var funcName = Object.keys(recordArgList[thisInd])[0];
		var args = recordArgList[thisInd][funcName];
		args.push("don't pass");

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

	function closeFunc() {
		var thisInd = this.id.split("-")[1];

		recordArgList.splice(thisInd, 1);
		d3.selectAll("#bc-" + thisInd ).remove();
		resort();
	}
}