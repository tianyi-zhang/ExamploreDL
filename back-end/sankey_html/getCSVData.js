function readTextFile(file)
{
    var finalOut = d3.csv(file)
        .then(function(data) {
            var taskDict = {},
                modelDict = {},
                datasetDict = {};

            function classifyRecords(data, tarStr, tarDict) {
                
                var tar = data[tarStr];
                if ((typeof tar)=='string' && tar.includes(', ')) {
                    var tarLi = tar.split(', ');
                } else {
                    var tarLi = [tar];
                }
                for (var j=0; j<tarLi.length; j++) {
                    var tarName = tarLi[j].replace(" ", "_");
                    if (Object.keys(tarDict).includes(tarName)) {
                        tarDict[tarName].push(data['ID']);
                    } else {
                        tarDict[tarName] = [data['ID']];
                    }
                }
                return tarDict;
            }

            
            for (var i=0; i<data.length; i++) {
                taskDict = classifyRecords(data[i], 'Tasks', taskDict);
                modelDict = classifyRecords(data[i], 'Models', modelDict);
                datasetDict = classifyRecords(data[i], 'Datasets', datasetDict);
            }

            function createCell(rowId, dict, maxLengthTb, claChx) {
                let newRow = document.getElementById(rowId);               
                for (var l=0; l<maxLengthTb; l++) {
                    let newCell = newRow.insertCell(l);
                    if (l<Object.keys(dict).length) {
                        var key = Object.keys(dict)[l];
                        var checkbox = document.createElement('input');
                        checkbox.type = "checkbox";
                        checkbox.class = 'myCheckbox';
                        checkbox.value = dict[key];
                        checkbox.id = "myCheckbox";
                        checkbox.checked = false;

                        var label = document.createElement('label')
                        label.htmlFor = "id";
                        var words = key.replace("_", " ");
                        
                        label.appendChild(document.createTextNode(words));

                        newCell.appendChild(checkbox);
                        newCell.appendChild(label);
                    }
                }
            }

            var outData = {"datasetsTr":datasetDict, "tasksTr":taskDict, "modelsTr":modelDict};
            var maxLengthTb = d3.max([Object.keys(taskDict).length, Object.keys(modelDict).length, Object.keys(datasetDict).length]);
            
            let dTr = document.getElementById("datasetsTr");
            createCell('datasetsTr', datasetDict, maxLengthTb, 'dChx');
            let tTr = document.getElementById("tasksTr");
            createCell('tasksTr', taskDict, maxLengthTb, 'tChx');
            let mTr = document.getElementById("modelsTr");
            createCell('modelsTr', modelDict, maxLengthTb, 'mChx');
            
            return outData;
        })
    return finalOut;
    
}