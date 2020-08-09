var json_file = "./static/output.json";
var mixData = readCSVFile('./static/projects.csv');
var filterData, csvData;

mixData.then(function(oriData) {
	[filterData, csvData] = oriData;
	var newCheckData = [];
	var allId = [];
	for (var ind=0; ind<csvData.length; ind++) {
		allId.push(csvData[ind]["ID"]);
	}
	var idList = [];
	var selectOrder = {};
	//selectOrder={"0": {"datasetTr": [id1, id2]}}
	d3.selectAll("#myCheckbox").on("click",clickFilter);
	//update();
	
	function update(thisClassName){	

		function genContainId(newOrder) {
			var containIdLi = [];		
			var startModifyPos = 0;	
			var isEmpty = 0;	
			d3.selectAll("."+thisClassName).each(function(d){
				var cb = d3.select(this);
				if(cb.property("checked")){
					isEmpty = 1;
					var val = cb.property("value").split(',');
					if (newOrder == 0) {
						for (var i=0; i<val.length; i++) {
							if (!containIdLi.includes(val[i])) {
								containIdLi.push(val[i]);
							}	
						}
						if (Object.keys(selectOrder).length == 0) {
							startModifyPos = -1;
						} else {
							startModifyPos = 1;
						}
						
					} else {
						var upperIdLi = Object.values(selectOrder[""+(newOrder-1)])[0];
						for (var i=0; i<val.length; i++) {							
							if (upperIdLi.includes(val[i]) && (!containIdLi.includes(val[i]))) {
								containIdLi.push(val[i]);
							}	
						}
						if (newOrder==Object.keys(selectOrder).length) {
							startModifyPos = -1;
						} else {
							startModifyPos = newOrder + 1;
						}						
					}	
				}
			})
			var newOrderDict = {};
			newOrderDict[thisClassName] = containIdLi;
			selectOrder[newOrder] = newOrderDict;
			if (startModifyPos == 0) {
				startModifyPos = 1;
			}
			if (startModifyPos !== -1) {
				for (var j=startModifyPos; j<Object.keys(selectOrder).length; j++) {
					var preId = Object.values(selectOrder[""+(j-1)])[0];
					
					var newContainId = [];
					var newClassName = Object.keys(selectOrder[""+j])[0];

					d3.selectAll("."+newClassName).each(function(d){
						var newcb = d3.select(this);
						if(newcb.property("checked")){
							var newval = newcb.property("value").split(',');
							for (var k=0; k<newval.length; k++) {
								if (preId.includes(newval[k]) && (!(newContainId.includes(newval[k])))) {
									newContainId.push(newval[k]);
								}
							}
						}
					})
					var newDict = {};
					newDict[newClassName] = newContainId;
					selectOrder[""+j] = newDict;
				}
			}
			return isEmpty;
		}
		var flag = 0;
		for (var i=0; i<Object.keys(selectOrder).length; i++) {
			var key = Object.keys(selectOrder)[i];
			if (thisClassName in selectOrder[key]) {
				flag = 1;
				var isEmptyResult = genContainId(i);
				break;
			}
		}
		if (flag == 0) {
			var newOrder = Object.keys(selectOrder).length;
			var isEmptyResult = genContainId(newOrder);			
		}
		var notNone = 0;
		if (isEmptyResult == 0) {
			if (Object.keys(selectOrder).length == 1) {
				idList = allId;
				selectOrder = {};
				d3.selectAll("#chart").remove();
				d3.selectAll(".slider-xaxis").remove();
				d3.selectAll(".slider-rect").remove();
				d3.selectAll(".slider-text").remove();
				d3.selectAll(".brush").remove();
				d3.selectAll(".handle--custom").remove();
				d3.selectAll(".slider-label").remove();
				d3.selectAll("#thumbnail").remove();
				d3.selectAll(".newProjectDiv").remove();
				d3.selectAll(".projectInfoDiv").remove();
				d3.selectAll("#legendSvg").remove();
				d3.selectAll("#paraLegend").remove();
				d3.selectAll(".paraChart").remove();
				document.getElementById("sankeyInfo").innerHTML = "Number of Projects: 0; Number of Models: 0";
				updateFilterSVG(idList, thisClassName);
				notNone = 0;
			} else if (Object.keys(selectOrder).length > 1) {
				idList = Object.values(Object.values(selectOrder)[Object.keys(selectOrder).length-2])[0];
				notNone = 1;
			}
		} else {
			idList = Object.values(Object.values(selectOrder)[Object.keys(selectOrder).length-1])[0];
			notNone = 1;
		}
		for (const orderKey in selectOrder) {
			var key = Object.keys(selectOrder[orderKey])[0];
			if (selectOrder[orderKey][key].length==0) {
				delete selectOrder[orderKey];
			}
		}
		if (notNone == 1) {
			d3.selectAll("#viewbtn").each(function(d){
				var cb = d3.select(this);
				if(cb.property("checked")){
					var viewName = cb.property("value");
					var JSONpath = './static/data.json';
					genData(idList, JSONpath, viewName);
					updateFilterSVG(idList, thisClassName);
				}
			}); 

			d3.selectAll('#viewbtn').on("click",updateView);
			function updateView() {
				d3.selectAll("#viewbtn").each(function(d){
					var cb = d3.select(this);
					if(cb.property("checked")){
						var viewName = cb.property("value");
						var JSONpath = './static/data.json';
						genData(idList, JSONpath, viewName);
						updateFilterSVG(idList, thisClassName);
					}
				});
			}
		}
	}
	
	function clickFilter() {
		update(this.className);
	} 
})