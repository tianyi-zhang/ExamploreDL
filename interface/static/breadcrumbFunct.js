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
			'Convolution': "#20C6FE",
			'Deconvolution': "#4dd2fe",
			'Max Pooling': "#0F7BA3",
			'Average Pooling': "#0b5875",
			//
			'LSTM': "#D48E9C",
			'GRU': "#C46677",
			'BiRNN': "#bf596c",
			'RNN': "#B43F56",
			'CRF': "#97293E",
			'Attention': "#6E202F",
			//
			'Input': "#D8C28E",
			'Dense': "#C9AB66",
			'Flatten': "#179D3E",
			'Dropout': "#aa883c",
			//
			'Embedding': "#ff1a1f",
			'Normalization': "#DD0005",
			'Optimizer': "#e60005",
			//					
			'ReLu': "#FFFF17",
			'Sigmoid': "#FFFF6D",
			'Softmax': "#DFE509",
			'Linear': "#f7fa84",
			'tanh': "#f1f622",
			//
			'Cross Entropy': "#FC20FF",
			'CTC': "#fc1aff",
			'L2': "#e200e6",
			'MSE': "#b000b3"
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