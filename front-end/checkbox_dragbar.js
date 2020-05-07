// import java.util.*;

// preload() to load data
// validate() listen to checkbox selection to select filtered_data
// dragbar_validate() listen to dradbar selection, 
// keep the filtered_data and start a new data array filtered_data2,
// drawbar() draws based on filtered_data2.
// Preset the 4 number to be original number
var num_img_data = 0;
var num_vid_data = 0;
var num_txt_data = 0;
var num_other_data = 0;

var num_spe_task = 0;
var num_cv_task = 0;
var num_nlp_task = 0;

var num_CNN_model = 0;
var num_LSTM_model = 0;
var num_GRU_model = 0;
var num_RNN_model = 0;

var alldata = 0;

var checkbox_names = ['Image','Video','Text','Other','speech','cv','nlp','CNN','LSTM','GRU','RNN']
// Alse set seperate boxes because we will need to filter those seperately later on
var checkbox_datasets = ['Image','Video','Text','Other']
var checkbox_tasks = ['speech','cv','nlp']
var checkbox_models = ['CNN','LSTM','GRU','RNN']

// CHECKBOX NEWLY NO HARDCODE
// var checkbox_names = []
// var checkbox_datasets = []
// var checkbox_tasks = []
// var checkbox_models = []

var filtered_data = [];
var accuracy_histograms = [];
var dimension_histograms = [];

// for draw barchart
var bin = 10;
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 360 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// Dimension
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
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

// // Accuracy
// var svg2 = d3.select("#my_dataviz2")
//   .append("svg2")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g2")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // Initialize the X axis
// var x2 = d3.scaleBand()
//   .range([ 0, width ])
//   .padding(0.2);
// var xAxis2 = svg2.append("g2")
//   .attr("transform", "translate(0," + height + ")")

// // Initialize the Y axis
// var y2 = d3.scaleLinear()
//   .range([ height, 0]);
// var yAxis2 = svg2.append("g2")
//   .attr("class", "myYaxis2")


function preload(){
  // Count for the original
  d3.csv("datas/projects.csv", function(data){
    // TEST SUCCEED
    // console.log(filter_status);
    // console.log(data);
    // Set up a dictionary

    data.forEach(function(d){
      // TO REPLACE THE HARDCODE CHECKBOXES, YOU COULD UNCOMMENT THOSE
      // var dataset_ofthisline = d.Datasets.split(",")
      // var task_ofthisline = d.Tasks.split(",")
      // var model_ofthisline = d.Models.split(",")

      // for (int i = 0; i<dataset_ofthisline.length; i++){
      //   if !(checkbox_datasets.includes(dataset_ofthisline[i])){
      //     checkbox_datasets.append(dataset_ofthisline[i])
      //   }
      //   if !(checkbox_tasks.includes(task_ofthisline[i])){
      //     checkbox_datasets.append(dataset_ofthisline[i])
      //   }
      //   if !(checkbox_tasks.includes(model_ofthisline[i])){
      //     checkbox_datasets.append(dataset_ofthisline[i])
      //   }     

      alldata++;
      // For the dataset column
      this_d = d.Datasets
      if (this_d.includes('Image')){
        num_img_data++;
      }

      if (this_d.includes('Video')){
        num_vid_data++;
      }

      if (this_d.includes('Text')){
        num_txt_data++;
      }

      // For the task column
      this_t = d.Tasks
      if (this_t.includes('speech')){
        num_spe_task++;
      }

      if (this_t.includes('cv')){
        num_cv_task++;
      }

      if (this_t.includes('nlp')){
        num_nlp_task++;
      }

      // For the model column
      this_m = d.Models
      if (this_m.includes('CNN')){
        num_CNN_model++;
      }

      if (this_m.includes('LSTM')){
        num_LSTM_model++;
      }

      if (this_m.includes('GRU')){
        num_GRU_model++;
      }

      if (this_m.includes('RNN')){
        num_RNN_model++;
      }

      // else{
      //   num_other_data++;
      //   // The number is not correct
      //   // Some images data are put here as well
      //   // console.log(this_d);
      // }
      num_other_data = alldata-num_img_data-num_vid_data-num_txt_data;
    })

    // TEST
    // console.log(num_img_data);
    // console.log(num_vid_data);
    // console.log(num_txt_data);
    // console.log(num_other_data);

    // console.log(num_spe_task);
    // console.log(num_cv_task);
    // console.log(num_nlp_task);

    // console.log(num_CNN_model);
    // console.log(num_LSTM_model);
    // console.log(num_GRU_model);
    // console.log(num_RNN_model);
  })
}

// define the validate function
var validate = function(){
  // get the check status

  // Set up an array to store the checked boxes and unchecked boxes
  var checked_boxes = [];
  var unchecked_boxes = [];

  // Go through each checkbox to update the lists
  for (var i = 0; i < checkbox_names.length; i++){
    // checked is a boolean
    var checked = document.getElementById(checkbox_names[i]).checked;
    // Take only the name so we could use in filter later
     var name = checkbox_names[i].split('_')[0];
    if (checked){
      checked_boxes.push(name);
    }
    else{
      unchecked_boxes.push(name);
    }
  }
  // Test to see whether we have the right checkboxes (WORK WELL)
  // console.log(checked_boxes);

  checked_boxes_tasks = []
  checked_boxes_models = []
  checked_boxes_datasets = []

  // Update the checkboxes
  for (var i = 0; i < checked_boxes.length; i++){
    // console.log(checked_boxes[i]);
    if (checkbox_tasks.includes(checked_boxes[i])){
      checked_boxes_tasks.push(checked_boxes[i])
    }
    if (checkbox_models.includes(checked_boxes[i])){
      checked_boxes_models.push(checked_boxes[i]) 
    }
    if (checkbox_datasets.includes(checked_boxes[i])){
      checked_boxes_datasets.push(checked_boxes[i])
    }
  }

  // console.log(checked_boxes_tasks);
  // console.log(checked_boxes_models);
  // console.log(checked_boxes_datasets);

  // Read the data
  d3.csv("datas/projects.csv", function(data){
    // Preset the number of data that fits all filter requirements
    num_fit_all = 0;
    // Preset the data array that fits all filter requirements
    filtered_data = [];

    

    data.forEach(function(d){
      // Dataset for each row
      dataset = d.Datasets;
      // Task for each row
      task = d.Tasks;
      //  Model for each row
      model = d.Models;

      // See how many rows of data fit all filter requirements
      // Preset the fit to be true for each row at start
      fit = true;

      // Filter for each box seperately
      for (var i = 0; i < checked_boxes_tasks.length; i++){
        if (!task.includes(checked_boxes_tasks[i])){
          fit = false;
          break;
        }
      }

      for (var i = 0; i < checked_boxes_models.length; i++){
        if (!model.includes(checked_boxes_models[i])){
          fit = false;
          break;
        }
      }

      for (var i = 0; i < checked_boxes_datasets.length; i++){
        if (!dataset.includes(checked_boxes_datasets[i])){
          fit = false;
          break;
        }
      }

      // If it fits all requirements
      if (fit == true){
        // Take record of the number
        num_fit_all ++;
        // Store the fits-all data
        filtered_data.push(d);
      }
    })  

    // Test to see whether we have the right filtered data (WORK WELL)
    // console.log("number of data that fits all");
    // console.log(num_fit_all);
    // // What LITAO needs
    // console.log("filtered rows");
    // console.log(filtered_data);

    // // Update the data shown on screen
    // d3.select(".text1")
    //     .data(filters[0])
    //     .text(function(d){return ""+filters[0].value});

    dragbar_validate();
    update_checkbox_number();
  })  
}

// Drag bar to change the filtered data
var dragbar_validate = function(){
  // Filtered_data2 filters the filtered_data
  filtered_data2 = [];
  // Count for max, min for the selection datas
  accuracy = filtered_data.concat().sort((a,b) => (parseFloat(a.Accuracy) > parseFloat(b.Accuracy)) ? 1 : ((parseFloat(b.Accuracy) > parseFloat(a.Accuracy)) ? -1 : 0));
  input_dimensions = filtered_data.concat().sort((a, b) => (parseFloat(a.Input_Dimensions) > parseFloat(b.Input_Dimensions)) ? 1 : ((parseFloat(b.Input_Dimensions) > parseFloat(a.Input_Dimensions)) ? -1 : 0))
  num_parameters = filtered_data.concat().sort((a, b) => (parseFloat(a.Num_Parameters) > parseFloat(b.Num_Parameters)) ? 1 : ((parseFloat(b.Num_Parameters) > parseFloat(a.Num_Parameters)) ? -1 : 0))

  // console.log(accuracy);
  min_accuracy = accuracy[0].Accuracy;
  max_accuracy = accuracy[accuracy.length-1].Accuracy;
  min_parameter = num_parameters[0].Num_Parameters;
  max_parameter = num_parameters[num_parameters.length-1].Num_Parameters;
  min_dimension = input_dimensions[0].Input_Dimensions;
  max_dimension = input_dimensions[input_dimensions.length-1].Input_Dimensions;

  dif_accuracy = max_accuracy - min_accuracy;
  dif_parameter = max_parameter - min_parameter;
  dif_dimension = max_dimension - min_dimension;

  // Dim_Value = 0;

  // d3.select("#DimensionSlider").on("change", function(d){
  //   Dim_Value = this.value;
  //   // console.log(Dim_Value);
  //   // filter the data out   
  // })

  Dim_Value = document.getElementById('DimensionSlider').value;
  // console.log(Dim_Value);
  Acu_Value = document.getElementById('AccuracySlider').value;
  // console.log(Acu_Value);
  Para_Value = document.getElementById('ParameterSlider').value;
  // console.log(Para_Value);

  for (var i = 0; i < filtered_data.length; i++){
      // console.log(filtered_data[i].Input_Dimensions);
      // console.log(parseFloat(min_dimension)+parseFloat(Dim_Value/6*dif_dimension));
      // If that fills the filter requirements
      if(filtered_data[i].Input_Dimensions >= parseFloat(min_dimension)+parseFloat(Dim_Value/bin*dif_dimension) 
        && filtered_data[i].Accuracy >= parseFloat(min_accuracy)+parseFloat(Acu_Value/bin*dif_accuracy)
        && filtered_data[i].Num_Parameters >= parseFloat(min_parameter)+parseFloat(Acu_Value/bin*dif_parameter)){
        filtered_data2.push(filtered_data[i]);
      }
  }
  console.log(filtered_data2);


  // d3.select("AccuracySlider").on("change", function(e){
  //   selectedValue2 = this.value;
  //   console.log(selectedValue2);
  // })
  // var 
  // for (var i = 0; i < dimension_histograms.length; i++){
  //   // Only get the smaller value lists
  //   if (dimension_histograms[i].value <= selectedValue){

  //   }
  // }
  draw_bar();
}

var update_checkbox_number = function(){
  // Image2 = [];
  // Video2 = [];
  // Text2 = [];
  // Speech2 = [];
  // CV2 = [];
  // Languae2 = [];
  // CNN = [];
  // LSTN = [];
  // RNN = [];
  // GRU = [];
  // CPU = [];
  // GPU = [];
  // console.log(filtered_data2);
  // for (int i = 0; i < filtered_data2.length; i++){
  //   if (filtered_data2.Datasets.include)
  // }
}

var draw_bar = function(){
  // Set up arrays to see the filtered out input dimensions, accuracy and num_parameters
  input_dimensions  = []
  accuracy = []
  num_parameters = []
  for (var i = 0; i < filtered_data2.length; i++){
    input_dimensions.push(filtered_data2[i].Input_Dimensions);
    accuracy.push(filtered_data2[i].Accuracy);
    num_parameters.push(filtered_data2[i].Num_Parameters);
  }

  // For each one of those, get the smallest and the largest
  // For accuracy
  accuracy.sort();
  input_dimensions.sort();
  // WHY SORT DOESN'T WORK HERE AT ALL?
  num_parameters.sort();

  accuracy2 = filtered_data2.concat().sort((a,b) => (parseFloat(a.Accuracy) > parseFloat(b.Accuracy)) ? 1 : ((parseFloat(b.Accuracy) > parseFloat(a.Accuracy)) ? -1 : 0));
  input_dimensions2 = filtered_data2.concat().sort((a, b) => (parseFloat(a.Input_Dimensions) > parseFloat(b.Input_Dimensions)) ? 1 : ((parseFloat(b.Input_Dimensions) > parseFloat(a.Input_Dimensions)) ? -1 : 0))
  num_parameters2 = filtered_data2.concat().sort((a, b) => (parseFloat(a.Num_Parameters) > parseFloat(b.Num_Parameters)) ? 1 : ((parseFloat(b.Num_Parameters) > parseFloat(a.Num_Parameters)) ? -1 : 0))


  min_accuracy = accuracy2[0].Accuracy;
  max_accuracy = accuracy2[accuracy.length-1].Accuracy;
  min_parameter = num_parameters2[0].Num_Parameters;
  max_parameter = num_parameters2[num_parameters.length-1].Num_Parameters;
  min_dimension = input_dimensions2[0].Input_Dimensions;
  max_dimension = input_dimensions2[input_dimensions.length-1].Input_Dimensions;

  dif_accuracy = max_accuracy - min_accuracy;
  dif_parameter = max_parameter - min_parameter;
  dif_dimension = max_dimension - min_dimension;


  // Divide each into 6 colums and see how many number in each
  accuracy_histograms = [];
  parameter_histograms = [];
  dimension_histograms = [];
  // accuracy_histograms[] -- 6* single_histogram_info_accuracy{} -- data(row) filter_accuracy_data_his[] -- + upperbound of that number
  // console.log(num_parameters.length);

  // For each of the column, count how many data we have here
  for (var i = 1; i < bin+1; i++){

    filter_dimension_data_his = [];
    filter_accuracy_data_his = [];
    filter_parameter_data_his = [];

    // Go through each filtered out data
    for (var j = 0; j< filtered_data2.length; j++){
      // console.log(dif_accuracy*i/6);       
      // console.log(dif_parameters*i/6);
      if (num_parameters2[j].Num_Parameters<= parseFloat(dif_accuracy*i/bin)+parseFloat(min_parameter) && num_parameters2[j].Num_Parameters>= parseFloat(dif_accuracy*(i-1)/bin)+parseFloat(min_parameter)){
        filter_parameter_data_his.push(input_dimensions2[j]);
      }
      if (input_dimensions2[j].Input_Dimensions<= parseFloat(dif_dimension*i/bin)+parseFloat(min_dimension) && input_dimensions2[j].Input_Dimensions>= parseFloat(dif_dimension*(i-1)/bin)+parseFloat(min_dimension)){
        filter_dimension_data_his.push(input_dimensions2[j]);
        // single_histogram_dimension++;
      }
      if (accuracy2[j].Accuracy<= parseFloat(dif_accuracy*i/bin)+parseFloat(min_accuracy) && accuracy2[j].Accuracy>= parseFloat(dif_accuracy*(i-1)/bin)+parseFloat(min_accuracy)){
        filter_accuracy_data_his.push(accuracy2[j]);
        // single_histogram_acurracy++;
      }
    }

    // Create object to store the value scale of each histogram and the height of it
    var single_histogram_info_dimension = {
      data:filter_dimension_data_his,
      bound:(parseFloat(dif_dimension*i/bin)+parseFloat(min_dimension)).toFixed(2),
      // value:single_histogram_dimension,
    }

    var single_histogram_info_accuracy = {
      data:filter_accuracy_data_his,
      bound:(parseFloat(dif_accuracy*i/bin)+parseFloat(min_accuracy)).toFixed(2),
      // value:single_histogram_acurracy,
    }

    var single_histogram_info_parameter = {
      data:filter_parameter_data_his,
      bound:parseFloat(dif_parameter*i/bin)+parseFloat(min_accuracy).toFixed(2),
      // value:single_histogram_acurracy,
    }

    accuracy_histograms.push(single_histogram_info_dimension);
    parameter_histograms.push(single_histogram_info_parameter);
    dimension_histograms.push(single_histogram_info_accuracy);
  }
  // Test whether we have each histogram's info right (WORK WELL)
  // console.log(accuracy_histograms);
  // console.log(paramet er_histograms);
  // console.log(dimension_histograms);
  // console.log(filtered_data);
  // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
  //   console.log(data);
  // });

  // Draw histogram for input dimensions
  // X axis
  ac = accuracy_histograms;
  pa = parameter_histograms;
  di = dimension_histograms;
  console.log(ac);
  console.log(pa);
  console.log(di);
// DIMENSION
  x.domain(di.map(function(d) { return d.bound; }))
  xAxis.transition().duration(100).call(d3.axisBottom(x))

  // Add Y axis
  y.domain([0, d3.max(di, function(d) { return +d.data.length }) ]);
  // yAxis.transition().duration(100).call(d3.axisLeft(y));

  // variable u: map data to existing bars
  var u = svg.selectAll("rect")
    .data(di)
  // update bars
  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(100)
      .attr("x", function(d) { return x(d.bound); })
      .attr("y", function(d) { return y(d.data.length); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.data.length); })
      .attr("fill", "#2290A6")

// // ACCURACY
//   x2.domain(ac.map(function(d) { return d.bound; }))
//   xAxis2.transition().duration(100).call(d3.axisBottom(x))

//   // Add Y axis
//   y2.domain([0, d3.max(ac, function(d) { return +d.data.length }) ]);
//   yAxis2.transition().duration(100).call(d3.axisLeft(y2));

//   // variable u: map data to existing bars
//   var u2 = svg2.selectAll("rect")
//     .data(ac)
//   // update bars
//   u2
//     .enter()
//     .append("rect")
//     .merge(u2)
//     .transition()
//     .duration(100)
//       .attr("x2", function(d) { return x2(d.bound); })
//       .attr("y2", function(d) { return y2(d.data.length); })
//       .attr("width", x2.bandwidth())
//       .attr("height", function(d) { return height - y2(d.data.length); })
//       .attr("fill", "#2290A6")
update_checkbox_number();
}

preload();
// dragbar_validate();

