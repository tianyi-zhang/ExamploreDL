var genHyperLi = function(tarId, data) {
	var li = [];
	var tarDict = {};
	for (const i in data) {
		for (const arg in data[i]) {
			var flag = 0;
			for (var j=0; j<li.length; j++) {
				if (li[j]['key'] == arg) {
					li[j]['li'].push(data[i][arg]);
					flag = 1;
					break;
				}
			}
			if (flag == 0) {
				var newHyper = {'key': arg, 'li': [data[i][arg]]};
				li.push(newHyper);
			}
			if (tarId == i) {
				tarDict[arg] = [data[i][arg]];
			}	
		}
	}
	return [li, tarDict];
}
var hyperparameterChart = function(hyperData, tarId='') {

	drawLegend();
	
	d3.selectAll(".chart2-text").remove();
	d3.selectAll(".chart2-rect").remove();
	d3.selectAll(".chart2-xaxis").remove();

	var margin = {top: 30, right: 0, bottom: 30, left: 50},
			width = 300 - margin.left - margin.right,
			height = 180 - margin.top - margin.bottom;

	var returnHyper = genHyperLi(tarId, hyperData);

	var return_li = returnHyper[0];

	var hist = function(svgThis, d) {

		var num_sticks = 5;
		var max_x = function(d) {return d3.max(d.li) * (1 + 1/num_sticks)}

		var x = d3.scaleLinear()
			.domain([0,max_x(d)]) 
			.range([0, width]);

		svgThis.append("g")
			.attr('class', 'chart2-xaxis')
			.style("font-size", "14px")
			.attr("transform", "translate(20," + (height+40) + ")")
			.call(d3.axisBottom(x).ticks(num_sticks));

		// set the parameters for the histogram
		var bins = d3.histogram()
			.domain(x.domain())
			.thresholds(x.ticks(8))
		(d.li)

		// And apply this function to data to get the bins
		

		// Y axis: scale and draw:
		var y = d3.scaleLinear()
			.range([height, 0]);
			y.domain([0, d3.max(bins, function() {return d.li.length + 1; })]);	 // d3.hist has to be called before the Y axis obviously
		/*
		svg_this.append("g")
				.call(d3.axisRight(y).ticks(num_sticks));
		*/

		return [x, y, bins]
	}

	var text_pos = [];
	for (i=0; i<return_li.length; i++) { 	

		var nowKey = return_li[i].key;
		var Mysvg = d3.select("#para-"+(i+1))
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		[x, y, bins] = hist(Mysvg, return_li[i]);

		var inside_li = [];
		Mysvg
			.selectAll("rect"+i)
			.data(bins)
			.enter()
			.append("rect")
				.attr("id", nowKey)
				.attr("class", "chart2-rect")
				.attr("x", 0)
				.attr("rx", 6)
				.attr("transform", function(d) {return "translate(" + (20+x(d.x0)) + "," + (y(d.length)+40) + ")"; })
				.attr("width", function(d) { 
					var wi = x(d.x1) - x(d.x0) -1 || 0;
					if (wi==-1) {
						return 0;
					} else {
						return wi; 
					}					
				})
				.attr("height", function(d) {
					if (d.length != 0) {

						inside_li.push([d.length, (x(d.x0)+x(d.x1))/2, y(d.length)]);
					}
					return height - y(d.length); 
				})
				.style("fill", function(d) {
					if (nowKey in returnHyper[1]) {

						for (k=0; k<returnHyper[1][nowKey].length; k++) {

							var target_arg_val = returnHyper[1][nowKey][k];
							
							if ((d.x0 <= target_arg_val) && (target_arg_val < d.x1)) {
								flag = 1;
								return "#8D85EE";
							}
				
						}
						return "#BBB5F0";
					} else {
						return "#BBB5F0";
					}
				});
				/*.on("click", function(d) {
					newData(d.x0, d.x1, json_data, this.id, selected_cat)
				})*/

		text_pos.push(inside_li); 
		
		for (j=0; j<inside_li.length; j++) {

			Mysvg
				.append("text")
				.attr("class", "chart2-text")
				.attr("text-anchor", "middle")
				.attr("y", (height+35))
				.attr("x", (inside_li[j][1]+20))
				.text(inside_li[j][0])
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.style("fill", "#ffffff")
		}

		Mysvg
			.append("text")
			.attr("class", "chart2-text")
			.attr("text-anchor", "middle")
			.attr("y", 20)
			.attr("x", (width/2+20))
			.text("Hyperparameter: "+nowKey)
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.attr("fill", "#505050");

		if (nowKey in returnHyper[1]) {

			Mysvg
				.append("rect")
				.attr("class", "chart2-text")
				.attr("y", 35)
				.attr("x", 0)
				.attr("width", "100%")
				.attr("height", "30px")
				.attr("fill", "#8D85EE")
				.attr("rx", 6)
				.attr("ry", 6);

			Mysvg
				.append("text")
				.attr("class", "chart2-text")
				.attr("text-anchor", "middle")
				.attr("y", 55)
				.attr("x", (width/2+20))
				.text(function() {
					return nowKey+" = ["+returnHyper[1][nowKey]+"]";
				})
				.style("font-family", "sans-serif")
				.attr("font-size","18px")
				.attr("font-weight", 100)
				.style("fill", "white");
		}
		
	}
}
