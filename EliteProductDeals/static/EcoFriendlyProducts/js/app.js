
let openOrNew = "New";
let VTABLE = null;

let scenarioDimScore={};

//ForModalWindow

const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".modal-button");
const newUploadButton = document.getElementById("upload");
const closeButton = document.querySelector(".close-button");
const scrollDown = document.querySelector(".scroll-down");
let isOpened = false;

var firstModalPage = document.getElementById("firstModalPage");
var secondModalPage = document.getElementById("secondModalPage");
var thirdModalWindow = document.getElementById("thirdModalWindow");
var fourthModalWindow = document.getElementById("fourthModalWindow");


let descriptiveValueMap = {
    'low': 2,
    'low-mid': 4,
    'mid': 6,
    'mid-high': 8,
    'high': 10
};


const openModal = () => {


  modal.classList.add("is-open");
  body.style.overflow = "hidden";
  openOrNew = "New";
  VTABLE = null;
  var table = document.querySelector("#firstModalPage table.flat-table");

    // Clear existing rows
    while (table.rows.length > 2) {
        table.deleteRow(1);
    }
    clearRow(table);


};

const openOpenModal = () => {
    // firstModalPage.style.display = 'block';
    // thirdModalWindow.style.display = 'none';
    modal.classList.add("is-open");
    body.style.overflow = "auto";
    openOrNew = "Open";
  };

const closeModal = () => {
  modal.classList.remove("is-open");
  body.style.overflow = "initial";
  firstModalPage.style.display = "block";
  secondModalPage.style.display = "none";
  thirdModalWindow.style.display = "none";
  fourthModalWindow.style.display = "none";
};


modalButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
newUploadButton.addEventListener("click", openOpenModal);

document.onkeydown = evt => {
  evt = evt || window.event;
  evt.keyCode === 27 ? closeModal() : false;
};


//Functions


function addCategoryRow() {
    var table = document.querySelector("table");

    // Calculate the total weight in existing rows
    var existingWeight = calculateTotalWeight();

    if (existingWeight >= 1.0) {
        alert("Error: Total weight in existing rows exceeds 1.0. Cannot add a new row.");
        return;
    }

    var newRow = table.insertRow(-1);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);

    cell1.innerHTML = '<input type="text" name="category_name[]" required>';
    cell2.innerHTML = `
        <select name="scoring_type[]">
            <option value="number">Number</option>
            <option value="descriptive">Descriptive</option>
        </select>`;
    cell3.innerHTML = `<input type="number" step="0.01" name="weight[]" placeholder="Remaining: ${(1.0 - existingWeight).toFixed(2)}" oninput="updateRemainingWeight(this)"><span class="error-message" style="font-size: 10px;"></span>`;
    cell4.innerHTML = `
        <select name="direction_to_optimize[]">
            <option value="up">Up</option>
            <option value="down">Down</option>
        </select>`;
    cell5.innerHTML = `
        <span class="delete-icon" onclick="deleteRow(this)">🗑️</span>
        <span class="clear-icon" onclick="clearRow(this)">🔄</span>`;
}

function updateRemainingWeight(input) {
    var table = document.querySelector("table");
    var weightInputs = table.querySelectorAll('input[name="weight[]"]');

    var totalWeight = 0.0;

    weightInputs.forEach(function (weightInput) {
        var weightValue = parseFloat(weightInput.value) || 0;
        totalWeight += weightValue;
    });

    var remainingWeight = 1.0 - totalWeight;

    if (remainingWeight >= 0) {
        // If there is still remaining weight, set it as a placeholder for the current input
        input.placeholder = "Remaining: " + remainingWeight.toFixed(2);
    } else {
        // If the remaining weight is negative, throw an error
        alert("Error: Total weight exceeds 1.0");
        input.value = "";
    }
}

function calculateTotalWeight() {
    var table = document.querySelector("table");
    var weightInputs = table.querySelectorAll('input[name="weight[]"]');

    var totalWeight = 0.0;

    weightInputs.forEach(function (weightInput) {
        var weightValue = parseFloat(weightInput.value) || 0;
        totalWeight += weightValue;
    });

    return totalWeight;
}
function addScenarioRow() {
    var table = document.querySelectorAll("table")[1];
    var newRow = table.insertRow(-1);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    // var cell3 = newRow.insertCell(2);

    cell1.innerHTML = '<input type="text" name="scenario_name[]">';
    // cell2.innerHTML = '<input type="number" step="0.01" name="scenario_value[]">';
    cell2.innerHTML = `
        <span class="delete-icon" onclick="deleteRow(this)">🗑️</span>
        <span class="clear-icon" onclick="clearRow(this)">🔄</span>`;
}

function deleteRow(element) {
    var row = element.parentElement.parentElement;
    row.parentNode.removeChild(row);
}

function clearRow(element) {
    var row = element.parentElement.parentElement;
    var inputs = row.querySelectorAll('input');
    for (var input of inputs) {
        input.value = '';
    }
}

function updateRemainingWeight(input) {
    var table = document.querySelector("table");
    var weightInputs = table.querySelectorAll('input[name="weight[]"]');

    var totalWeight = 0.0;

    weightInputs.forEach(function (weightInput) {
        var weightValue = parseFloat(weightInput.value) || 0;
        totalWeight += weightValue;
    });

    var remainingWeight = 1.0 - totalWeight;

    if (remainingWeight >= 0) {
        // If there is still remaining weight, set it as a placeholder for the current input
        input.placeholder = "Remaining: " + remainingWeight.toFixed(2);
    } else {
        // If the remaining weight is negative, throw an error
        alert("Error: Total weight exceeds 1.0");
        input.value = "";
    }
}


function validateWeight(input) {
    var value = parseFloat(input.value);
    console.log(value);
    var errorMessage = input.parentElement.querySelector('.error-message');

    if (isNaN(value) || value < 0 || value > 1) {
        errorMessage.textContent = "Weight must be a number between 0 and 1.";
        return false;
    } else {
        errorMessage.textContent = "";
    }
    return true;
}


//
function getCategoryData() {
    var table = document.querySelector("table");
    var categoryData = [];

    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var cells = row.cells;

        var categoryName = cells[0].querySelector('input[name="category_name[]"]').value;
        var scoringType = cells[1].querySelector('select[name="scoring_type[]"]').value;
        var weight = cells[2].querySelector('input[name="weight[]"]').value;
        var directionToOptimize = cells[3].querySelector('select[name="direction_to_optimize[]"]').value;

        categoryData.push({
            categoryName: categoryName,
            scoringType: scoringType,
            weight: weight,
            directionToOptimize: directionToOptimize
        });
    }

    return categoryData;
}

function getScenarioData() {
    var table = document.querySelectorAll("table")[1];
    var scenarioData = [];

    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var cells = row.cells;
        // console.log(cells);
        var scenarioName = cells[0].querySelector('input[name="scenario_name[]"]').value;
        // var scenarioValue = cells[1].querySelector('input[name="scenario_value[]"]').value;

        scenarioData.push({
            scenarioName: scenarioName,
            // scenarioValue: scenarioValue
        });
    }

    return scenarioData;
}

function getValuesTableData(){
    var table = document.getElementById("table-container").querySelector("table");
    var values = [];
    var rows = table.rows;

    // Iterate through rows, starting from the first data row (skip the header)
    for (var i = 1; i < rows.length; i++) {
        var scenario = { data: {} };
        var cells = rows[i].cells;

        for (var j = 1; j < cells.length; j++) {
            var inputElement = cells[j].querySelector('input, select');
            var columnName = table.rows[0].cells[j].textContent;

            if (inputElement) {
                // Retrieve the value from the input element
                var value = inputElement.value;
                scenario.data[columnName] = value;
            }
        }

        // Add the scenario data to the values array
        values.push(scenario);
    }

    var updatedValuesData = [];
    var scenarioData = getScenarioData();

    for (var i = 0; i < scenarioData.length; i++) {
        var scenarioName = scenarioData[i].scenarioName;
        var data = values[i].data;
        updatedValuesData.push({ [scenarioName]: data });
    }

    return updatedValuesData;
}



function valueTable(){

    console.log(openOrNew);
    if(openOrNew == "Open" && VTABLE){
        console.log(openOrNew);
        redirectToValuesTable();
        populateValuesTable(VTABLE);
        return;
    }
    var tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = "";

    var categoryData = getCategoryData();
    var scenarioData = getScenarioData();
    var categoryData = categoryData.filter(entry => entry.categoryName != "");
    var scenarioData = scenarioData.filter(entry => entry.scenarioName != "");
    //console.log(categoryWithoutEmpty);
    //console.log(allNamesEmpty);

    if (categoryData.length == 0 && scenarioData.length==0) {
         alert('Enter the Category & Scenario Names');
         return;
    } else if(categoryData.length == 0){
        alert('Enter the Category Names');
        return;
    }else if(scenarioData.length==0){
        alert('Enter the Scenario Names');
        return;
    }



    var table = document.createElement("table");
    var headerRow = table.insertRow(0);
    var firstColNRow = headerRow.insertCell(0);
    firstColNRow.textContent="";



    // Create header cells with category names
    for (var i = 0; i < categoryData.length; i++) {
        if (categoryData[i].categoryName !== '') {
            var categoryCell = headerRow.insertCell(headerRow.cells.length);
            categoryCell.textContent = categoryData[i].categoryName;
        } else{
            console.log("Empty");
        }
    }

    // Create rows with scenario names and input fields
    for (var i = 0; i < scenarioData.length; i++) {
        var scenarioRow = table.insertRow(i + 1);
        var scenarioNameCell = scenarioRow.insertCell(0);
        scenarioNameCell.textContent = scenarioData[i].scenarioName;

        // Create cells for scenario values in corresponding categories with the appropriate input fields
        for (var j = 0; j < categoryData.length; j++) {
            var categoryCell = scenarioRow.insertCell(scenarioRow.cells.length);
            if(categoryData[j].scoringType === 'descriptive'){
                var select = document.createElement("select");
                select.name = 'scenario_value';
                var descriptiveOptions = ['low', 'low-mid', 'mid', 'mid-high', 'high'];
                for (var option of descriptiveOptions) {
                    var optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                }
                categoryCell.appendChild(select);
            }
            else{
                var input = document.createElement("input");
                input.type = "number";
                input.name = 'scenario_value';
                categoryCell.appendChild(input);
            }

        }
    }

    tableContainer.appendChild(table);
    redirectToValuesTable();
    // var submit_button = document.getElementById("temp-submit-button");
    // submit_button.style.display = "block";

}


function mapDescriptiveToInteger(value) {
    return descriptiveValueMap[value] || 0; // Default to 0 if the value is not found in the map
}

function mapToIntval(value) {

    return descriptiveValueMap[value];
}

function replaceDescriptiveValues(data) {
    return data.map(obj => {
        for (let key in obj) {
            for (let prop in obj[key]) {
                if (descriptiveValueMap.hasOwnProperty(obj[key][prop])) {
                    obj[key][prop] = mapToIntval(obj[key][prop]);
                }
            }
        }
        return obj;
    });
}

function minAndMaxValue(data){

    const categories = Object.keys(data[0][Object.keys(data[0])[0]]);

    const result = {};

    categories.forEach(category => {
    const values = data.map(item => Object.values(item)[0][category]);
    result[category] = {
        min: Math.min(...values),
        max: Math.max(...values)
    };
    });

    console.log("this is the min and max values: ", result)
    return result;
}


function calculateScore() {
    var categoryData = getCategoryData();
    var scenarioData = getScenarioData();
    var valuesData = getValuesTableData();
    var dimensionlessScores = {};

    console.log(categoryData)
    console.log(scenarioData)
    console.log(valuesData)

    console.log("P: ", minMaxValues);

    for (var category of categoryData) {
        var categoryName = category.categoryName;
        var categoryWeight = category.weight;
        var directionToOptimize = category.directionToOptimize;
        console.log("categoryName: ", categoryName);
        console.log("categoryWeight: ", categoryWeight);
        console.log("directionToOptimize: ", directionToOptimize);
        console.log("Cat:", category)
        console.log("Val:", valuesData);

        // Find min and max values for the category
        // var min = Number.MAX_VALUE;
        // var max = Number.MIN_VALUE;
        // var i=0;
        // for (var scenario of valuesData) {
        //     var value = parseFloat(scenario[Object.keys(scenario)[0]][categoryName]);
        //     if (!isNaN(value)) {
        //         if (value < min) {
        //             min = value;
        //         }
        //         if (value > max) {
        //             max = value;
        //         }
        //     }
        //     i++;
        // }


        newValData = replaceDescriptiveValues(valuesData);
        console.log("NewValData: ", newValData);

        var minMaxValues = minAndMaxValue(valuesData);
        min = minMaxValues[category.categoryName].min;
        max = minMaxValues[category.categoryName].max;

        console.log("CategorY: ", category.categoryName,"Min:", min, " Max: ", max);
        // console.log("min: ", min, " max :", max);

        // Calculate linear scores for each scenario in this category
        for (var scenario of scenarioData) {
            var scenarioName = scenario.scenarioName;
            var value = valuesData.find(data => data.hasOwnProperty(scenarioName))[scenarioName][categoryName];
            if (category.scoringType === 'descriptive') {
                // Map descriptive value to integer value
                value = parseFloat(mapDescriptiveToInteger(value));
            } else{
                value = parseFloat(value);
            }
            console.log("s: ", scenarioName, "value: ", value);




            if (!isNaN(value)) {
                scenarioDimScore[scenarioName] = scenarioDimScore[scenarioName] || {};
                scenarioDimScore[scenarioName][categoryName] = categoryWeight*((min - value) / (max - min))
                console.log("CategoryName: ", categoryName, "categoryWeight: ", categoryWeight, "value: ",value, "DimVal: ", scenarioDimScore[scenarioName][categoryName]);
                if (directionToOptimize === 'down') {
                    // Minimize the linear score
                    dimensionlessScores[scenarioName] = dimensionlessScores[scenarioName] || {};
                    dimensionlessScores[scenarioName][categoryName] = -1*(categoryWeight*((min - value) / (max - min)));
                } else if (directionToOptimize === 'up') {
                    // Maximize the linear score
                    dimensionlessScores[scenarioName] = dimensionlessScores[scenarioName] || {};
                    dimensionlessScores[scenarioName][categoryName] = categoryWeight*((min - value) / (max - min));
                }
            }
        }
    }

    // After calculation, the valuesData object now contains the calculated linear scores.
    console.log("DIM:", dimensionlessScores);
    var totalScores = totalScoreForEachScenario(dimensionlessScores);
    plot(totalScores);
    redirectToGraphs();
}


function totalScoreForEachScenario(dimensionlessScores){
    var totalscore = [];
    for (var scenario in dimensionlessScores) {
        if (dimensionlessScores.hasOwnProperty(scenario)) {
            var sum = 0;

            for (var category in dimensionlessScores[scenario]) {
                if (dimensionlessScores[scenario].hasOwnProperty(category)) {
                    sum += dimensionlessScores[scenario][category];
                }
            }

            totalscore[scenario] = sum;
        }
    }
    console.log("TotalScore: ", totalscore);
    return totalscore;
}


function saveDataToTSV(categoryData, scenarioData, valuesData) {

    var categoryData = getCategoryData();
    var scenarioData = getScenarioData();
    var valuesData = getValuesTableData();
    console.log("C: ", categoryData);
    console.log("S: ", scenarioData);
    console.log("V: ", valuesData);
    // Combine all data into a single array
    var allData = [categoryData, scenarioData, valuesData];

    // Convert the data to TSV format
    var tsvContent = allData.map(dataArray => dataArray.map(entry => Object.values(entry).map(value => JSON.stringify(value)).join('\t')).join('\n')).join('\n\n');
    console.log("tsv: ",tsvContent);

    // Create a Blob containing the TSV content
    var blob = new Blob([tsvContent], { type: 'text/tsv' });

    // Create a link element to trigger the download
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'data.tsv';

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
}

// Function to populate the Category table
function populateCategoryTable(data) {
    var table = document.querySelector("#firstModalPage table.flat-table");

    // Clear existing rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Populate with new data
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);


        cell1.innerHTML = '<input type="text" name="category_name[]" value="' + data[i][0] + '">';
        cell2.innerHTML = `
            <select name="scoring_type[]">
                <option value="number" ${data[i][1] === 'number' ? 'selected' : ''}>Number</option>
                <option value="descriptive" ${data[i][1] === 'descriptive' ? 'selected' : ''}>Descriptive</option>
            </select>`;
        cell3.innerHTML = `<input type="number" step="0.01" name="weight[]" value="${parseFloat(data[i][2])}" oninput="updateRemainingWeight(this)">
            <span class="error-message" style="font-size: 10px;"></span>`;
        cell4.innerHTML = `
            <select name="direction_to_optimize[]">
                <option value="up" ${data[i][3] === 'up' ? 'selected' : ''}>Up</option>
                <option value="down" ${data[i][3] === 'down' ? 'selected' : ''}>Down</option>
            </select>`;
        cell5.innerHTML = `
            <span class="delete-icon" onclick="deleteRow(this)">🗑️</span>
            <span class="clear-icon" onclick="clearRow(this)">🔄</span>`;
    }
}

// Function to populate the Scenario table
function populateScenarioTable(data) {
    var table = document.querySelector("#secondModalPage table");

    // Clear existing rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }


    // Populate with new data
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);


        cell1.innerHTML = '<input type="text" name="scenario_name[]" value="' + data[i][0] + '">';
        cell2.innerHTML = `
            <span class="delete-icon" onclick="deleteRow(this)">🗑️</span>
            <span class="clear-icon" onclick="clearRow(this)">🔄</span>`;
    }
}

// Function to populate the Values table
function populateValuesTable(data) {

    // var firstArrayValues = Object.values(data[0][0]);

    var dataArr = [];
    for(var i=0;i<data.length; i++){
        // console.log();
        dataArr[i] = Object.values(data[i][0]);
    }
    console.log(dataArr);
    // thirdModalWindow.style.display = "none";
    var tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = "";
    // tableContainer.style.display = "none";

    var categoryData = getCategoryData();
    var scenarioData = getScenarioData();
    var categoryData = categoryData.filter(entry => entry.categoryName != "");
    var scenarioData = scenarioData.filter(entry => entry.scenarioName != "");

    var table = document.createElement("table");
    var headerRow = table.insertRow(0);
    var firstColNRow = headerRow.insertCell(0);
    firstColNRow.textContent="";

    // Create header cells with category names
    for (var i = 0; i < categoryData.length; i++) {
        if (categoryData[i].categoryName !== '') {
            var categoryCell = headerRow.insertCell(headerRow.cells.length);
            categoryCell.textContent = categoryData[i].categoryName;
        } else{
            console.log("Empty");
        }
    }

    // Create rows with scenario names and input fields
    for (var i = 0; i < scenarioData.length; i++) {
        var scenarioRow = table.insertRow(i + 1);
        var scenarioNameCell = scenarioRow.insertCell(0);
        scenarioNameCell.textContent = scenarioData[i].scenarioName;

        // Create cells for scenario values in corresponding categories with the appropriate input fields
        for (var j = 0; j < categoryData.length; j++) {
            var categoryCell = scenarioRow.insertCell(scenarioRow.cells.length);
            if(categoryData[j].scoringType === 'descriptive'){
                console.log("Here:",dataArr[i][j]);
                var select = document.createElement("select");
                select.name = 'scenario_value';
                var descriptiveOptions = ['low', 'low-mid', 'mid', 'mid-high', 'high'];
                for (var option of descriptiveOptions) {
                    var optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;

                    if (option === dataArr[i][j]) {
                        console.log(option,"==", dataArr[i][j]);
                        optionElement.selected = true;
                    }
                    select.appendChild(optionElement);
                }

                categoryCell.appendChild(select);

            }
            else{
                var input = document.createElement("input");
                input.type = "number";
                input.name = 'scenario_value';
                input.value = dataArr[i][j];
                categoryCell.appendChild(input);
            }

        }
    }

    tableContainer.appendChild(table);
    // var submit_button = document.getElementById("temp-submit-button");
    // submit_button.style.display = "block";
    redirectToValuesTable();
}

// Modify the loadTSVFile function
function loadTSVFile(file) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var content = e.target.result;
        var dataArray = content.split('\n\n');

        // Assuming the structure of dataArray is [categoryData, scenarioData, valuesData]
        var categoryData = parseTSV(dataArray[0]);
        var scenarioData = parseTSV(dataArray[1]);
        var valuesData = parseTSV(dataArray[2]);

        console.log("C: ", categoryData);
        console.log("S: ", scenarioData);
        console.log("V: ", valuesData);

        // Populate the tables
        populateCategoryTable(categoryData);
        populateScenarioTable(scenarioData);
        // populateValuesTable(valuesData);
        VTABLE = valuesData;
    };

    reader.readAsText(file);
}

// Helper function to parse TSV
function parseTSV(data) {
    var rows = data.split('\n');
    var result = [];

    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split('\t');

        // Check if the column contains a JSON string
        var parsedColumns = columns.map(function (col) {
            try {
                return JSON.parse(col);
            } catch (error) {
                // If JSON parsing fails, use the original value
                return col;
            }
        });

        result.push(parsedColumns);
    }

    return result;
}




// Example Usage:
// Assuming you have an input element for file upload like <input type="file" id="fileInput">
document.getElementById('fileInput').addEventListener('change', function (event) {
    var inputFile = event.target.files[0];

    loadTSVFile(inputFile, function (categoryData, scenarioData, valuesData) {
        // Use the loaded data as needed, e.g., populate tables
        console.log('Loaded Category Data:', categoryData);
        console.log('Loaded Scenario Data:', scenarioData);
        console.log('Loaded Values Data:', valuesData);
    });
});

function uploadFile() {
    // Trigger the click event of the hidden file input
    document.getElementById('fileInput').click();
}


function plot(totalScores){
    const keys = Object.keys(totalScores);
    console.log("Inplot: ", keys);
    const values = Object.values(totalScores);
    console.log("Inplot: ", values);
    var chart = document.getElementById('chart');
    var piechart = document.getElementById('pie-chart');
    var barchart = document.getElementById('bar-chart');

    // Find the key with the highest value
    const maxIndex = values.indexOf(Math.max(...values));
    const recommendedScenario = keys[maxIndex];

    // Display the recommended scenario in a div
    var bestScenario = document.getElementById('bestScenario');
    bestScenario.innerHTML = `<h2>Recommended Scenario: ${recommendedScenario}</h2>`;

    console.log("Result: ", scenarioDimScore);
    console.log("Result: ", Object.keys(scenarioDimScore));



    var data = values.map((value, index) => ({
        x: [keys[index]],
        y: [value],
        type: 'bar',
        name: `${keys[index]}`, // Set a unique legend entry for each bar
        marker: {
            color: value, // Use the value as the color
            colorscale: 'Viridis', // You can change the colorscale if needed
            cmin: Math.min(...values),
            cmax: Math.max(...values),
        },
    }));

    var layout = {
        title: 'Scenario Ranking - Bar Chart',
        showlegend: true}

    //   var myDiv = document.getElementById("myDiv");

    Plotly.newPlot(chart, data, layout, {modeBarButtonsToRemove: [ 'pan','zoom', 'autoscale', 'lasso', 'select', 'resetScale2d']});

    // Scaling and shifting values to the range [0, 100]
    const scaledValues = values.map(val => (val + 1) * 50);

    var pieChartData = [
        {
            labels: keys,
            values: scaledValues,
            type: 'pie',
        }
    ];

    var layout = {
        title: 'Scenario Ranking - Pie Chart',
        showlegend: true}

    Plotly.newPlot(piechart, pieChartData, layout);

    var xValues = Object.keys(scenarioDimScore.Bike); // Assuming all objects have the same keys
    var traces = [];

    // Create traces dynamically
    for (var key in scenarioDimScore) {
    if (scenarioDimScore.hasOwnProperty(key)) {
        var trace = {
        x: xValues,
        y: xValues.map(function (quality) {
            return scenarioDimScore[key][quality];
        }),
        name: key,
        type: 'bar'
        };
        traces.push(trace);
    }
    }

    console.log("Traces: ", traces)

    // Create layout
    var layout = { title: 'Dimensionless Score of each Category',barmode: 'group' };

    Plotly.newPlot(barchart, traces, layout, {modeBarButtonsToRemove: [ 'pan','zoom', 'autoscale', 'lasso', 'select', 'resetScale2d']});


    var categories = Object.keys(scenarioDimScore.Bike);

    var stackChart = document.getElementById('stack-chart');

    // Initialize an array to store traces
    var traces = [];

    // Create traces dynamically for each category
    categories.forEach(function (category) {
    var trace = {
        x: Object.keys(scenarioDimScore),
        y: Object.values(scenarioDimScore).map(function (vehicle) {
        return vehicle[category];
        }),
        name: category,
        type: 'bar'
    };
    traces.push(trace);
    });

    console.log("StackTraces: ", traces);

    // Create layout
    var layout = { title: 'Dimensionless Score of each Scenario',barmode: 'stack' };

    // Plot the chart
    Plotly.newPlot(stackChart, traces, layout, {modeBarButtonsToRemove: [ 'pan','zoom', 'autoscale', 'lasso', 'select', 'resetScale2d']});

}


function redirectToScenarioTable(){
    var firstModalPage = document.getElementById("firstModalPage");
    var secondModalPage = document.getElementById("secondModalPage");
    secondModalPage.style.display="block";
    firstModalPage.style.display="none";
}


function redirectToValuesTable(){
    var secondModalPage = document.getElementById("secondModalPage");
    var thirdModalWindow = document.getElementById("thirdModalWindow");
    secondModalPage.style.display="none";
    thirdModalWindow.style.display="block";
}

function redirectBackToCategoryTable(){
    var secondModalPage = document.getElementById("secondModalPage");
    var firstModalPage = document.getElementById("firstModalPage");
    secondModalPage.style.display="none";
    firstModalPage.style.display="block";
}


function redirectBackToScenarioTable(){
    var secondModalPage = document.getElementById("secondModalPage");
    var thirdModalWindow = document.getElementById("thirdModalWindow");
    thirdModalWindow.style.display="none";
    secondModalPage.style.display="block";
}

function redirectToGraphs(){
    var thirdModalWindow = document.getElementById("thirdModalWindow");
    var fourthModalWindow = document.getElementById("fourthModalWindow");
    thirdModalWindow.style.display="none";
    fourthModalWindow.style.display="block";
}


function redirectBackToValuesTable(){
    var thirdModalWindow = document.getElementById("thirdModalWindow");
    var fourthModalWindow = document.getElementById("fourthModalWindow");
    fourthModalWindow.style.display="none";
    thirdModalWindow.style.display="block";

}