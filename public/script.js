var req = new XMLHttpRequest();
req.open("GET", "/get-data", true);
req.setRequestHeader('Content-Type', 'application/json');
req.addEventListener('load', function(){
    if (req.status >= 200 && req.status < 400)
    {
        createTable(JSON.parse(req.responseText));
    }
});
req.send();

//Function to create the table using user input data to the completed workout table
function createTable(dataArray)
{
    var tableDiv = document.getElementById("workout-table");
    if (tableDiv.firstChild != null)
    {
        tableDiv.removeChild(tableDiv.firstChild);
    }
    var table = document.createElement("table");

    var headRow = document.createElement("tr");
    var headCell1 = document.createElement("th");
    var headCell2 = document.createElement("th");
    var headCell3 = document.createElement("th");
    var headCell4 = document.createElement("th");
    var headCell5 = document.createElement("th");
    var headCell6 = document.createElement("th");
    var headCell7 = document.createElement("th");

    headCell1.innerText = "Date";
    headRow.appendChild(headCell1);
    headCell2.innerText = "Name";
    headRow.appendChild(headCell2);
    headCell3.innerText = "Reps";
    headRow.appendChild(headCell3);
    headCell4.innerText = "Weight";
    headRow.appendChild(headCell4);
    headCell5.innerText = "Unit";
    headRow.appendChild(headCell5);
    headRow.appendChild(headCell6);
    headRow.appendChild(headCell7);

    table.appendChild(headRow);

    dataArray.forEach(function(row)
    {
        var dataRow = document.createElement("tr");

        var dateCell = document.createElement("td");
        var nameCell = document.createElement("td");
        var repCell = document.createElement("td");
        var weightCell = document.createElement("td");
        var unitCell = document.createElement("td");
        var editCell = document.createElement("td");
        var deleteCell = document.createElement("td");

        if (row["date"] != null)
        {
            dateCell.innerText = row["date"].substring(0,10);
        }

        dataRow.appendChild(dateCell);
        nameCell.innerText = row["name"];
        dataRow.appendChild(nameCell);
        repCell.innerText = row["reps"];
        dataRow.appendChild(repCell);
        weightCell.innerText = row["weight"];
        dataRow.appendChild(weightCell);
        if(row["lbs"] == 1)
        {
            unitCell.innerText = "lbs";
        }
        else if (row["lbs"] == 0)
        {
            unitCell.innerText = "kgs";
        }
        dataRow.appendChild(unitCell);

        //Create edit button
        var form = document.createElement('form');
        var inputId = document.createElement('input');
        inputId.setAttribute('type', "hidden");
        inputId.setAttribute('value', row["id"]);
        var button = document.createElement('input');
        button.setAttribute('type', "button");
        button.setAttribute('value', "Edit");
        button.setAttribute('class', "edit");
        form.appendChild(inputId);
        form.appendChild(button);
        editCell.appendChild(form);
        dataRow.appendChild(editCell);

        //Create delete button
        var form = document.createElement('form');
        var inputId = document.createElement('input');
        inputId.setAttribute('type', "hidden");
        inputId.setAttribute('value', row["id"]);
        var button = document.createElement('input');
        button.setAttribute('type', "button");
        button.setAttribute('value', "Delete");
        button.setAttribute('class', "delete");
        form.appendChild(inputId);
        form.appendChild(button);
        deleteCell.appendChild(form);
        dataRow.appendChild(deleteCell);

        table.appendChild(dataRow);
    });
    tableDiv.appendChild(table);

    //Add click events for edit and delete buttons
    var editButtons = document.getElementsByClassName("edit");
    for (var i = 0; i < editButtons.length; i++)
    {
        editButtons[i].addEventListener('click', editEvent, false);
    }

    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++)
    {
        deleteButtons[i].addEventListener('click', deleteEvent, false);
    }   
}

//Function to add exercise data and have it returned from database via AJAX
document.getElementById("addExercise").addEventListener("click", function(e)
{
    var req = new XMLHttpRequest();
    var payload = {date:null, name:null, reps:null, weight:null, unit:null};
    payload.date = document.getElementById('new-date').value || null;
    document.getElementById('new-date').value = null;
    payload.name = document.getElementById('new-name').value || null;
    document.getElementById('new-name').value = null;
    payload.reps = document.getElementById('new-reps').value || null;
    document.getElementById('new-reps').value = null;
    payload.weight = document.getElementById('new-weight').value || null;
    document.getElementById('new-weight').value = null;
    if (document.getElementById('new-unit').checked == true)
    {
        payload.unit = 1;
    }
    else
    {
        payload.unit = 0;
    }

    if (payload.name == null)
    {
        alert("Please enter exercise name.");
        e.preventDefault();
        return;
    }
    req.open("POST", "/add", true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function()
    {
        if (req.status >= 200 && req.status < 400)
        {
            createTable(JSON.parse(req.responseText));
        }
        else
        {
            console.log("Error in request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
    e.preventDefault();
});

//Function to delete exercise data and have table updated via AJAX
function deleteEvent(event)
{
    var req = new XMLHttpRequest();
    var id = this.previousSibling.value;
    var payload = {"id":id};
    req.open("POST", "/delete", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function()
    {
        if (req.status >= 200 && req.status < 400)
        {
            createTable(JSON.parse(req.responseText));
        }
        else
        {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
}

//Function to edit exercise data 
function editEvent(event)
{
    var updateButtons = document.getElementsByClassName("update");
    if (updateButtons.length > 0)
    {
        alert("Another exercise is already being modified.");
        return;
    }
    var curRow = this.parentElement.parentElement.parentElement;
    var dateInput = document.createElement("input");
    dateInput.setAttribute("value", curRow.children[0].innerText);
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("id", "update-date");
    curRow.children[0].innerText = "";
    curRow.children[0].appendChild(dateInput);

    var nameInput = document.createElement("input");
    nameInput.setAttribute("value", curRow.children[1].innerText);
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "update-name");
    curRow.children[1].innerText = "";
    curRow.children[1].appendChild(nameInput);

    var repInput = document.createElement("input");
    repInput.setAttribute("value", curRow.children[2].innerText);
    repInput.setAttribute("type", "number");
    repInput.setAttribute("id", "update-reps");
    repInput.setAttribute("class", "num-input");
    curRow.children[2].innerText = "";
    curRow.children[2].appendChild(repInput);

    var weightInput = document.createElement("input");
    weightInput.setAttribute("value", curRow.children[3].innerText);
    weightInput.setAttribute("type", "number");
    weightInput.setAttribute("id", "update-weight");
    weightInput.setAttribute("class", "num-input");
    curRow.children[3].innerText = "";
    curRow.children[3].appendChild(weightInput);

    var unitInput = document.createElement("select");
    unitInput.setAttribute("id", "update-unit");
    var option1 = document.createElement("option");
    option1.setAttribute("value", "1");
    option1.innerText = "lbs";
    unitInput.appendChild(option1);

    var option2 = document.createElement("option");
    option2.setAttribute("value", "0");
    option2.innerText = "kgs";
    unitInput.appendChild(option2);

    if(curRow.children[4].innerText == "lbs")
    {
        option1.selected = true;
    }
    else
    {
        option2.selected = true;
    }
    curRow.children[4].innerText = "";
    curRow.children[4].appendChild(unitInput);

    var id = this.previousSibling.value;
    curRow.children[5].innerText = "";
    var form = document.createElement("form");
    var updateButton = document.createElement("form");
    var inputId = document.createElement("input");
    inputId.setAttribute("type", "hidden");
    inputId.setAttribute("value", "id");
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Update");
    button.setAttribute("class", "update");
    form.appendChild(inputId);
    form.appendChild(button);
    curRow.children[5].appendChild(form);

    button.addEventListener("click", updateEvent, false);
    event.preventDefault();
}

//Function to update data and display updates from the database via AJAX
function updateEvent(event)
{
    var id = this.previousSibling.value;
    var req = new XMLHttpRequest();
    var payload = {id:null, date:null, name:null, reps:null, weight:null, unit: null};
    payload.date = document.getElementById("update-date").value || null;
    payload.name = document.getElementById("update-name").value;
    payload.reps = document.getElementById("update-reps").value || null;
    payload.weight = document.getElementById("update-weight").value || null;
    payload.unit = document.getElementById("update-unit").value;
    payload.id = id;
    req.open("POST", "/update", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.addEventListener("load", function()
    {
        if (req.status >=  200 && req.status < 400)
        {
            createTable(JSON.parse(req.responseText));
        }
        else
        {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
}