var generateParameterChart = function(selected_cat, json_data, svg_id, target_args) {

  d3.selectAll(".chart2-text").remove();
  d3.selectAll(".chart2-rect").remove();
  d3.selectAll(".chart2-xaxis").remove();

  var margin = {top: 30, right: 0, bottom: 30, left: 50},
      width = 300 - margin.left - margin.right,
      height = 180 - margin.top - margin.bottom;
  
  var get_data = function(d_node, selected_cat) {
    // d_node = data.nodes
    var return_li = [];
    //[{"key": "filters", "values" : [{"arg_value": 128, "frequency": 3, "name": ["conv2d-1"]}, {"arg_value": 64, "frequency": 2, "name": ["conv2d-2"]}], "li": [128, 128, 128, 64, 64, 64]}, {"key":"strides", "arg_value": [{"value": 2, "frequency": 3, "name": ["conv2d-1"]}], "li": [2, 2, 2]}]
    for (i=0; i<d_node.length; i++) {
      
      if (d_node[i].category === selected_cat) {
        var d_node_arg_li = Object.keys(d_node[i]["args"]);
        for (j=0; j<d_node_arg_li.length; j++) {
          // get arg name: tar_key
          
          var li_keys = {};
          // {"filters": 0}
          for (m=0; m<return_li.length; m++) {
            li_keys[return_li[m].key] = m;
          }
          
          var arg_name = d_node_arg_li[j];
          var val_li = d_node[i]["args"][arg_name];
          
          if (Object.keys(li_keys).includes(arg_name)) {
            // get the value list of args_data_dic

            
            // traverse each value in args_data_dic
            for (k=0; k<val_li.length; k++) {
              return_li[li_keys[arg_name]]["li"].splice(return_li[li_keys[arg_name]]["li"].length,0,val_li[k]);
              var val_dic = {};
              var return_li_arg_name_value = return_li[li_keys[arg_name]]["values"];
              for (l=0; l<return_li_arg_name_value.length; l++) {
                val_dic[return_li_arg_name_value[l]["arg_value"]] = l;
              }
              
              if (Object.keys(val_dic).includes('' + val_li[k])) {
                var add_position = return_li_arg_name_value[val_dic[val_li[k]]];
                add_position["frequency"] = add_position["frequency"] + 1;
                add_position["name"].splice(add_position["name"].length,0,d_node[i].name);
              } else {
                var add_position = return_li_arg_name_value;
                var new_dic = {"arg_value": val_li[k], "frequency": 1, "name": [d_node[i].name]};
                add_position.splice(add_position.length,0,new_dic);
              }
            }
          } else {
            
            var new_arg_dic = {"key": arg_name, "values": [], "li": []};
            for (k=0; k<val_li.length; k++) {
              new_arg_dic["li"].splice(new_arg_dic["li"].length,0,val_li[k]);
              var val_dic = {};
              var return_li_arg_name_value = new_arg_dic["values"];
              for (l=0; l<return_li_arg_name_value.length; l++) {
                val_dic[return_li_arg_name_value[l]["arg_value"]] = l;
              }
              if (Object.keys(val_dic).includes('' + val_li[k])) {
                var add_position = new_arg_dic["values"][val_dic[val_li[k]]];
                add_position["frequency"] = add_position["frequency"] + 1;
                add_position["name"].splice(add_position["name"].length,0,d_node[i].name);
              } else {
                var new_dic = {"arg_value": val_li[k], "frequency": 1, "name": [d_node[i].name]};
                new_arg_dic["values"].splice(new_arg_dic["values"].length,0,new_dic);
              }
              
            }
            return_li.splice(return_li.length,0,new_arg_dic);
          }
        }
      }
    }

    for (i=0; i<return_li.length; i++) {

      function bubbleSort (arr) {
        var max = arr.length - 1;
        for (var j = 0; j < max; j++) {
          var done = true;
          for (var k = 0; k < max - j; k++) {
            if (arr[k]["arg_value"] > arr[k + 1]["arg_value"]) {
              var temp = arr[k];
              arr[k] = arr[k + 1];
              arr[k + 1] = temp;
              done = false;
            }
          }
          if (done) {
            break;
          }
        }
        return arr;
      }
      var return_li_val = return_li[i]["values"];
      return_li[i]["values"] = bubbleSort(return_li_val);

    }

    return return_li;
  }

  var return_li = get_data(json_data, selected_cat);

  allKeys = return_li.map(function(d){return d.key})

  var hist = function(svg_this, d) {

    var num_sticks = 5;
    var max_x = function(d) {return d3.max(d.li) * (1 + 1/num_sticks)}

    var x = d3.scaleLinear()
        .domain([0,max_x(d)]) //(gen_arr(0, d3.max(d.li), 5))     
        .range([0, width]);
    svg_this.append("g")
        .attr('class', 'chart2-xaxis')
        .attr("transform", "translate(0," + height + ")")
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
        y.domain([0, d3.max(bins, function() {return d.li.length + 1; })]);   // d3.hist has to be called before the Y axis obviously
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
      .selectAll("uniqueChart")
      .data(return_li)
      .enter()
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    var svg_this = d3.selectAll("#para-"+(i+1));
    [x, y, bins] = hist(svg_this, return_li[i]);
    
    var inside_li = [];
    svg_this
      .selectAll("rect"+i)
      .data(bins)
      .enter()
      .append("rect")
      	.attr("id", nowKey)
        .attr("class", "chart2-rect")
        .attr("x", 0)
        .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) {
          if (d.length != 0) {

            inside_li.push([d.length, (x(d.x0)+x(d.x1))/2, y(d.length)]);
          }
          return height - y(d.length); 
        })
        .style("fill", function(d) {
          if (Object.keys(target_args).includes(nowKey)) {

            for (k=0; k<target_args[nowKey].length; k++) {

              var target_arg_val = target_args[nowKey][k];
              
              if ((d.x0 <= target_arg_val) && (target_arg_val < d.x1)) {
                flag = 1;
                return "orange";
              }
        
            }
            return "#69b3a2";
          } else {
            return "#69b3a2";
          }
        })
        .on("click", function(d) {
        	newData(d.x0, d.x1, json_data, this.id, selected_cat)
        }) 

    text_pos.push(inside_li); 
    
    for (j=0; j<inside_li.length; j++) {

      svg_this
        .append("text")
        .attr("class", "chart2-text")
        .attr("text-anchor", "middle")
        .attr("y", height-10)
        .attr("x", inside_li[j][1])
        .text(inside_li[j][0])
        .attr("font-size","15px")
        .style("fill", function() {
          if (height-10 > inside_li[j][2] + 15) {
            return "ffffff";
          } else {
            return "black"
          }
        })
    }

    svg_this
      .append("text")
      .attr("class", "chart2-text")
      .attr("text-anchor", "middle")
      .attr("y", 20)
      .attr("x", width/2)
      .text("Parameter: "+nowKey)
      .attr("font-size","20px")

    if (target_args != "none") {

    	svg_this
	      .append("text")
	      .attr("class", "chart2-text")
	      .attr("text-anchor", "middle")
	      .attr("y", 35)
	      .attr("x", width/2)
	      .text(function() {
	        if (target_args[nowKey].length == 0) {
	          return false;
	        } else {
	          return "Selected Parameters="+nowKey+": ["+target_args[nowKey]+"]";
	        }
	      })
	      .attr("font-size","15px")
	      .style("fill", "orange")
    }
    
  }
}
