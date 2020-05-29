var json_file = "./output.json";
var csvData = readCSVFile('./projects.csv');

csvData.then(function(oriData) {
	var [data, allData] = oriData;
	var newCheckData = [];

	//d3.selectAll("#myCheckbox").on("change",update);
	d3.selectAll("#myCheckbox").on("click",clickFilter);
	//update();
	
	function update(thisClassName){		
		var idList = [];
		
		d3.selectAll("#myCheckbox").each(function(d){
			cb = d3.select(this);
			if(cb.property("checked")){
				
				var val = cb.property("value").split(',');
				for (i=0; i<val.length; i++) {
					if (!(idList.includes(val[i]))) {
						idList.push(val[i]);
					}
				} 
			}
		});

		var JSONpath = './data.json';
		resultOut = genData(idList, JSONpath);

		resultOut.then(function(nodesData) {

			updateFilterSVG(data, idList, thisClassName);

			mainDraw(idList, nodesData);

			genInfo(allData, idList, nodesData[2]);

			updateSlider('accSvg', allData, idList, data, nodesData[2]);

			updateSlider('nopSvg', allData, idList, data, nodesData[2]);
		});	 
	}

	function clickFilter() {
		update(this.className);
	} 
})