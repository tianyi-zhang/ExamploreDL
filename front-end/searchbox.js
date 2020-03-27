// set the dimensions and margins of the graph
var margin = {top: 10, right: 0, bottom: 0, left: 60},
    width = 330 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.05);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  // .attr("class", "myYaxis")

d3.select("#mySlider1").on("change", function(d){
  selectedValue = this.value
  update(selectedValue)
})

// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  d3.csv("/searchboxData.csv", function(data) {
  // d3.csv("NeuralWork/searchboxData.csv", function(data) {
    // X axis
    x.domain(data.map(function(d) { return d.group; }))
    //xAxis.transition().duration(1000).call(d3.axisBottom(x))

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
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
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d[selectedVar]); })
        .attr("fill", "#2290A6")
  })

}

// Initialize plot
update('1')