var json_file = "./static/output.json";
var mixData = readCSVFile('./static/projects.csv');
var filterData, csvData, nodesData;

function union(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function intersection(setA, setB) {
    let _intersection = new Set()
    if (setB.size !== 0 && setA.size !== 0) {
    	for (let elem of setB) {
	        if (setA.has(elem)) {
	            _intersection.add(elem)
	        }
	    }
    } else if (setA.size == 0) {
    	_intersection = setB;
    } else {
    	_intersection = setA;
    }
    return _intersection
}

function checkSet(ele) {
	var checkedSet = new Set([]);
	for(var i=0; ele[i]; ++i){
    	if(ele[i].checked){
			var checkedValue = new Set(ele[i].value.split(","));
			checkedSet = union(checkedValue, checkedSet);
    	}
	}
	return checkedSet;
}

mixData.then(function(oriData) {
	[filterData, csvData] = oriData;
	var allId = [];
	for (var ind=0; ind<csvData.length; ind++) {
		allId.push(csvData[ind]["ID"]);
	}
	createClearButton(allId);
	d3.selectAll("#myCheckbox").on("click",clickFilter);
	function clickFilter() {
		var dsElements = document.getElementsByClassName('datasetsTr'),
			tsElements = document.getElementsByClassName('tasksTr'),
			moElements = document.getElementsByClassName('modelsTr');
		var filters = [dsElements, tsElements, moElements],
			idSet = new Set([]);
		for (var i=0; i<filters.length; i++) {
			idSet = intersection(checkSet(filters[i]), idSet);
		}
		idList = Array.from(idSet)
		var checkLength = idList.length;
		if (checkLength==0) {
			idList = zeroChecked(allId);
		} else {
			d3.selectAll("#viewbtn").each(function(d){
				var cb = d3.select(this);
				if(cb.property("checked")){
					var viewName = cb.property("value");
					var JSONpath = './static/data.json';
					genData(idList, JSONpath, viewName);
					updateFilterSVG(idList);
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
						updateFilterSVG(idList);
					}
				});
			}
		}
	}
});

function zeroChecked(allId) {
	updateFilterSVG(allId);
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
	return allId;
}

function createClearButton(allId) {
	function clearChecks(className) {
		var allElements = document.getElementsByClassName(className);
	    for(i = 0; i < allElements.length; i++){
	        if(allElements[i].id == 'myCheckbox') {
	        	allElements[i].checked = false;
	        }
	    }
	}

	var clearG = d3.select("#clearAllFacetsSvg")
		.attr('width', 200)
		.attr('height', 40)
		.append('g')
			.attr('id', 'clearG')
			.attr("transform", "translate(0,0)");

	var clearRect = clearG.append('rect')
		.attr('id', 'resetRect')
		.attr('x', 0)
		.attr('y', 5)
		.attr('width', 180)
		.attr('height', 30)
		.attr('rx', 10)
		.attr("ry", 10)
		.attr('fill', "#22B9FE")
		.on('click', function() {
			clearChecks("datasetsTr");
			clearChecks("tasksTr");
			clearChecks("modelsTr");
			zeroChecked(allId);
		});

	var clearText = clearG.append('text')
		.attr('text-anchor', 'middle')
		.attr('x', 90)
		.attr('y', 28)
		.text("RESET FACETS")
			.style("font-family", "sans-serif")
			.style("font-size", 20)
			.style("fill", "#ffffff")
			.on('click', function() {
				clearChecks("datasetsTr");
			clearChecks("tasksTr");
			clearChecks("modelsTr");
				zeroChecked(allId);
			});
}