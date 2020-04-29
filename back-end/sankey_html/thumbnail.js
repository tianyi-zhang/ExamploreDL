var json_file = "./output.json";

var idList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
var JSONpath = './data.json';
resultOut = genData(idList, JSONpath);

resultOut.then(function(data) {

  var max_length = data[1];

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 350 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom;

  const _sankey = d3.sankey()
    .nodeAlign(d3[`sankey${"Left"}`])
    .nodeWidth(3)
    .nodePadding(1)
    .extent([
      [1, 1],
      [width - 1, height - 5]
    ]);


  const sankey = ({nodes,links}) => _sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });


  const f = d3.format(",.0f");
  const format = d => `${f(d)}`;

  var wid_svg = 350;
  var height_svg = height;

  const {
    nodes,
    links
  } = sankey(data[0]);

  var svgThumb = d3.select('#thumbnail')
    .attr("viewBox", `0 0 ${wid_svg} ${height_svg}`)
    .attr('width', width+margin.left+margin.right)
    .attr('height', height_svg+margin.top+margin.bottom);

  var find_node_name = function (num, args_li) {
    var name_li = []
    for (i=0; i<args_li.length; i++) {
      if (args_li[i][1] === num) {
        name_li.splice(name_li.length, 0, args_li[i][0])
      }
    }
    return name_li
  }
  svgThumb.append("g")
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("id", d => d.name)
      .attr("class", d => d.category)
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => d.color)
      .attr("stroke", "#ffffff")
      
  const link = svgThumb.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.35)
    .selectAll("g")
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => d.color)
      .attr("id", function(d) {return "path" + d.target.name;})
      .attr("class", function(d) {return "path" + d.target.category;})
      .attr("stroke-width", d => Math.max(1, d.width));

  svgThumb
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", height)
    .attr("x", width/2)
    .text("Thumbnail")
    .attr("font-size","15px")

});