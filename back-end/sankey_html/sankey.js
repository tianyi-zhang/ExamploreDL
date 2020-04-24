var json_file = "./output.json";
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 750 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const _sankey = d3.sankey()
  .nodeAlign(d3[`sankey${"Left"}`])
  .nodeWidth(15)
  .nodePadding(10)
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

var wid_svg = 750
var wid_svg2 = 350
var height_svg = height 

var svg = d3.select('#chart')
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

var idList = ['0', '1', '2', '3', '4', '5', '6'];
var JSONpath = './data.json';
resultOut = genData(idList, JSONpath);

resultOut.then(function(data) {
  const {
    nodes,
    links
  } = sankey(data);
  svg.append("g")
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
      .on("click", function(d) {
        click_1(d);        
      })
      
    .append("title")
      .text(d => `${d.name}\n${format(d.value)}`);

  const link = svg.append("g")
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


  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg.append("g")
    .attr("font-family", "Calibri")
    .attr("font-size", 10)
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x1-15)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.355em")
      .attr("text-anchor", d => "end")
      .text(d => d.name);

  var get_catgory = function (data) {
    var cat_dic = {};
    data.forEach(function(d) {

    	if (d.type in cat_dic) {
    		cat_dic[d.type][d.category] = d.color;
    	} else {
    		cat_dic[d.type] = {};
    		cat_dic[d.type][d.category] = d.color;
    	}
    	
    });
    return cat_dic;
    // cat_dic = {"conv2d": "rgba()"}
  }

  var get_legend_li = function(cat_dic) {
  	var legend_li = [];
  	for (const key in cat_dic) {

  		for (const cat in cat_dic[key]) {
  			var ele = {};
  			ele[cat] = cat_dic[key][cat];
  			legend_li.splice(legend_li.length,0,ele);
  		}
  	}
  	return legend_li;
  }

  var cat_dic = get_catgory(data.nodes);

  var cat_li = Object.keys(cat_dic);

  var legend_li = get_legend_li(cat_dic);

  var get_type_name = function(legend_li) {
  	var type_li = []
  	for (i=0; i<legend_li.length; i++) {
  		type_li.splice(type_li.length,0,Object.keys(legend_li[i])[0]);
  	}
  	return type_li;
  };

  var legend_name = get_type_name(legend_li);

  var svg_table = d3.select('#chart_table').append("table");

  svg_table.append('thead')
       .attr("id", "svg_th")
    .append('tr')
      .selectAll('#svg_th')
      .data(cat_li).enter()
      .append('th')
      .attr("id", function(d, i) {return "svg_th_tr" + i;})
      .attr("class", "svg_th_tr")
      .attr("colspan", function(d) {
        return Object.keys(cat_dic[d]).length;
      })
      .style("background-color", "#ffffff")
      .style("border", "1px solid #848484")
      .style("font-family", "Calibri")
      .style("font-size", 10)
      .text(function(d) { return d; })
      .on("click", function (d, i) {
        click_2(d, i, cat_dic);    
      });


  svg_table.append('tbody')
      .attr("id", "svg_tb")
    .append('tr')
      .attr("id", "svg_tb_tr")
      .selectAll('#svg_tb')
      .data(legend_name).enter()
      .append('td')
        .attr("id", function(d, i) {return "svg_tb_td"+i;})
        .attr("class", "svg_tb_td")
        .style("background-color", function(d, i) {
          return legend_li[i][d];
        })
        .style("border", "1px solid #848484")
        .style("font-family", "Calibri")
        .style("font-size", 10)
        .text(function(d) { return d; })
        .on("click", function (d, i) {
          click_3(d, i, nodes);
        });

  //d3 = require("d3@5", "d3-sankey@0.7")
});