sortByfunction = function(selectObject) {
	var value = selectObject.value;	
	if (value !== "None" && value) {
    var toSort = document.getElementById('GitHub-info-div').children;
    toSort = Array.prototype.slice.call(toSort, 0);
    if (value == "Accuracy") {
      toSort.sort(function(a, b) {
        var aord = +a.textContent.split('Accuracy: ')[1].split("Num_Parameters: ")[0];
        var bord = +b.textContent.split('Accuracy: ')[1].split("Num_Parameters: ")[0];
        return bord - aord;
      });
    } else if (value == "Num_Parameters") {
      toSort.sort(function(a, b) {
        var aord = +a.textContent.split('Accuracy: ')[1].split("Num_Parameters: ")[1];
        var bord = +b.textContent.split('Accuracy: ')[1].split("Num_Parameters: ")[1];
        return bord - aord;
      });
    }
    
    var parent = document.getElementById('GitHub-info-div');
    parent.innerHTML = "";

    for(var i = 0, l = toSort.length; i < l; i++) {
        parent.appendChild(toSort[i]);
    }
	}
}