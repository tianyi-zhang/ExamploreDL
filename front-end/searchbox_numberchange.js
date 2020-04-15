// Read csv file first
// let origin_data;
// function preload(){
//   // Load csv data
//   origin_data = loadTable('datas/projects.csv','csv','header');
//   console.log(origin_data);
//   console.log('0');
// }

// function uploadData(){

// }

// Take user input
let datasets_selection = [];
let tasks_selection = [];
let models_selection = [];
let experiments_selection = [];

// ID of different buttons
let data_options = ['Image Dataset','Video Dataset','Text Dataset','Other Dataset'];
let task_optons = ['Speech Processing','Computer Vision','Natural Language Processing'];
let model_options = ['CNN','LSTM','GRU','RNN']
let experiment_options = ['CPU','GPU']

// store the row of data
let task = [];
let dataset = [];
let model = [];
let experiment = [];

// define the data
let value_image = 0;
let value_video = 0;
let value_text = 0;
let value_other = 0

d3.csv("datas/projects.csv", function(data){
  data.forEach(function(d){
     dataset = d.Datasets
     //console.log(d.Datasets)
     //console.log(dataset.includes('image'))
     if (dataset.includes('image') || dataset.includes('Image')){
        value_image++;      
     }

     if (dataset.includes('video') || dataset.includes('Video')){
        value_video++;      
     }

     if (dataset.includes('text') || dataset.includes('Text')){
        value_text++;      
     }

     if (dataset.includes('text') || dataset.includes('Text')){
        value_other++;      
     }
     var svgContainer = d3.select("dataset_image").append("svg")
                                                    .attr("width",100)
                                                    .attr("height",200)
     var textdata_image = svgContainer.selectAll("text")
      .data(value_image)
      .enter()
      .append("text")
  })
})

// console.log(value_image)  

function refilter(){
  var data1 = document.getElementById("Image Dataset").value;
  var data2 = document.getElementById("Video Dataset").value;
  var data3 = document.getElementById("Text Dataset").value;
  var data4 = document.getElementById("Other Dataset").value;
  // console.log(data1);
  // console.log(data2);
  // console.log(data3);
  // console.log(data4);
}

refilter()