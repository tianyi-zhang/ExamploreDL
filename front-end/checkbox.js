// Read csv file first

// Preset the 4 number to be original number
var num_img_data = 0;
var num_vid_data = 0;
var num_txt_data = 0;
var num_other_data = 0;
var alldata = 0;

var checkbox_names = ['Image_dataset','Video_dataset','Text_dataset','Other_dataset']

// // an object: which is not iterable
// var num_datas ={
//   image_dataset:num_img_data,
//   video_dataset:num_vid_data,
//   text_dataset:num_txt_data,
//   other_dataset:num_other_data,
// }
function preload(){
  // Count for the original
  d3.csv("datas/projects.csv", function(data){
    // TEST SUCCEED
    // console.log(filter_status);
    // console.log(data);
    // Set up a dictionary
    data.forEach(function(d){
      alldata++;
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

      // else{
      //   num_other_data++;
      //   // The number is not correct
      //   // Some images data are put here as well
      //   // console.log(this_d);
      // }
      num_other_data = alldata-num_img_data-num_vid_data-num_txt_data;
    })

    // TEST
    console.log(num_img_data);
    console.log(num_vid_data);
    console.log(num_txt_data);
    console.log(num_other_data);
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
  //console.log(checked_boxes);

  // Read the data
  d3.csv("datas/projects.csv", function(data){
    // Preset the number of data that fits all filter requirements
    num_fit_all = 0;
    // Preset the data array that fits all filter requirements
    filtered_data = [];

    data.forEach(function(d){
      // Dataset for each row
      dataset = d.Datasets;
      // See how many rows of data fit all filter requirements
      // Preset the fit to be true for this row
      fit = true;

      for (var i = 0; i < checked_boxes.length; i++){
        // Take the keyword
        word = checked_boxes[i];
        if (!dataset.includes(word)){
          fit = false;
          break;
        }
      }

      // If it fits all requirements
      if (fit == true){
        // Take record of the number
        num_fit_all ++;
        // Store the fits-all data
        filtered_data.push(dataset);
      }
    }) 
    // console.log(num_fit_all);
    // console.log(filtered_data);

    // An array to store the objects of all checkboxes
    filters = []

    // Change value for the checked box first
    for (var i = 0; i < checked_boxes.length; i++){
      // Set the object for the current checkbox
      var filter = {
        name:checked_boxes[i],
        value:num_fit_all,
      }
      // Push to the array
      filters.push(filter)
    }

    // Change value for the unchecked box
    for (var i = 0; i < unchecked_boxes.length; i++){
      var num_fit_this = 0;
      // Go through the filtered out data
      for (var k = 0; k < filtered_data.length; k++){
        // Get keyword
        word = unchecked_boxes[i];
        // If this box included, increase the number
        if (filtered_data[k].includes(word)){
          num_fit_this ++;
        }
      }

      var filter = {
        name:unchecked_boxes[i],
        value:num_fit_this,
      }
      filters.push(filter)
    }
    console.log(filters);
    console.log(filters[0].value)

    // Update the data shown on screen
    d3.select(".text1")
        .data(filters[0])
        .text(function(d){return ""+filters[0].value});
  })  
}

preload();