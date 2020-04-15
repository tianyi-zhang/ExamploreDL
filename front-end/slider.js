// set the dimensions and margins of the graph
var margin2 = {top: 10, right: 0, bottom: 0, left: 60},
    width2 = 330 - margin2.left - margin2.right,
    height2 = 100 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Initialize the X axis
var x2 = d3.scaleBand()
  .range([ 0, width2 ])
  .padding(0.05);
var xAxis2 = svg2.append("g")
  .attr("transform", "translate(0," + height2 + ")")

// Initialize the Y axis
var y2 = d3.scaleLinear()
  .range([ height2, 0]);
var yAxis2 = svg2.append("g")
  // .attr("class", "myYaxis")

// Listen to the slider?
d3.select("#mySlider2").on("change", function(d){
  selectedValue = this.value
  update(selectedValue)
})

// A function that create / update the plot for a given variable:
function update(selectedV) {

  // Parse the Data
  d3.csv("/searchboxData.csv", function(data) {
    // X axis
    x.domain(data.map(function(d) { return d.group; }))
    //xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedV] }) ]);
    //yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(data)

    // update bars
    u
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return y(d[selectedV]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height2 - y(d[selectedV]); })
        .attr("fill", "#2290A6")
  })
}



// // Initialize plot
update('var1')