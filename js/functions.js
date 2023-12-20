// globals
var contentMaster = document.createElement('div');
contentMaster.id = "content-master";
var recordList = [];
var locationList = [];
var playedGamesList = [];
var ratingList = [];
var filter = "std";
var keyword = "";
var editMode = false;

function start() {
    getLocations();
    getRecords();
    findPlayedGames();
    fillRatingList();
}
// functions
function getRecords() {
    fetch('php/sql_connect.php?method=get_records')
      .then(response => response.json())
      .then(data => { 
          for (let i = 0; i < data.length; i++) {
              recordList.push(data[i]);
          }
          buildGrid();
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

function getLocations() {
    fetch('php/sql_connect.php?method=get_locations')
    .then(response => response.json())
    .then(data => { 
        for (let i = 0; i < data.length; i++) {
            locationList.push(data[i]);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function buildGridReload() {
    return new Promise((resolve) => {
        switch (filter) {
            case 'std':
                contentMaster.innerHTML = '';
                for (let record of recordList) {
                    contentMaster.appendChild(createPanelBody(record));
                }
                // No need to append contentMaster to document.body here
                resolve();
                break;
            case 'filterByInput':
                contentMaster.innerHTML = '';
                for (let record of recordList) {
                    if (record["name"].toString().includes(keyword)) contentMaster.appendChild(createPanelBody(record));
                }
                // No need to append contentMaster to document.body here
                resolve();
                break;
            default:
                resolve();
                break;
        }
    });
}
function buildGrid() {
    switch(filter) {
        case 'std':
            contentMaster.innerHTML = '';
            for (let record of recordList) {
                contentMaster.appendChild(createPanelBody(record));
            }
            document.body.appendChild(contentMaster);    
            break;
        case 'filterByInput':
            contentMaster.innerHTML = '';
            for (let record of recordList) {
                if(record["name"].toString().includes(keyword)) contentMaster.appendChild(createPanelBody(record));
            }
            document.body.appendChild(contentMaster);    
            break;
        default:
            break;
    }
}


function resetEntry() {
    cleanForm();
}


function loopRecords() {
    for (let record of recordList) {
        contentMaster.appendChild(createPanelBody(record));
    }
    document.body.appendChild(contentMaster);    
}

function addButtonClick(record) {
    cleanForm();
    document.getElementById("saveButton").innerHTML = "Save";
    let modal = document.getElementById("dialogModal");
    let modalContent = document.getElementById("modal-content");
    let editModeInfo = document.getElementById("edit-mode");
    let span = document.getElementsByClassName("close")[0];
    var selectElement = document.getElementById("location");
    selectElement.innerHTML = '';
    locationList.forEach(function (location) {
    var option = document.createElement("option");
    option.text = location.name;
    selectElement.appendChild(option);
    });
    if(editMode == false) {
        editModeInfo.style.display = "none";
        modal.style.display = "inline-block";
        modalContent.style.border = "1px solid #fff";
        document.getElementById('start_date').value = getCurrentDate();
        document.getElementById("location").focus();
    }
    else {
        document.getElementById('img-cover-text').innerText = '';
        modal.style.display = "inline-block";
        modalContent.style.border = "1px solid limegreen";
        editModeInfo.style.display = "inline-block";
        updateForm(record);

    }
    span.onclick = function() {
        modal.style.display = "none";
        editMode = false;
    }
}


function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
}

function logoutButtonClick() {
        notify("Logout is forbidden.", "error");
    }


function notify(msg, type) {
    $.notify("" + msg,  type, 
        { position:"right bottom" }
      );
}

function showLoader(op) {
    const loaderWrapper = document.getElementById("loader-wrapper");

    if (op) {
        // Show the loader
        loaderWrapper.style.display = "flex";
    } else {
        // Hide the loader
        loaderWrapper.style.display = "none";
    }
}

function filterBySearch() {
    let input = document.getElementById("searchbar").value.length
    if(input > 3) {
        filter = "filterByInput";
        keyword = document.getElementById("searchbar").value;
        buildGrid();
    }
    else {
        filter = "std";
        keyword = "";
        buildGrid();
    }
}

function findPlayedGames() {
    // disabled while developing 
    addButton.disabled = true;
    notify("Fechting data from Steam... this may take a while.", "warn");
    var method = "findOwnedGames";
    $.ajax({
        url: 'php/steam_api.php',
        type: 'GET',
        data: { method: method },
        dataType: 'text', // Change dataType to 'text'
        success: function (response) {
            var data = JSON.parse(response);
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                playedGamesList.push(data[i]);
            }
            addSuggestionsToList();
            const addButton = document.getElementById("addButton");
            addButton.disabled = false;
            notify("Data fetched from Steam.", "success");

        },
        error: function (request, error) {
            alert("Error Request: " + error + " - - Request: " + JSON.stringify(request));
        }
    });
}

function addSuggestionsToList() {
    removeDuplicates();
    var datalist = document.getElementById("games-list");
    datalist.innerHTML = '';
    playedGamesList.forEach(function (game) {
        var option = document.createElement("option");
        option.value = game.split('=')[0];
        datalist.appendChild(option);
    });
}

function removeDuplicates() {
    var uniqueGamesSet = new Set(playedGamesList);
    playedGamesList = Array.from(uniqueGamesSet);
}

function fillRatingList() {
    ratingList.push("gameplay");
    ratingList.push("presentation");
    ratingList.push("narrative");
    ratingList.push("quality");
    ratingList.push("sound");
    ratingList.push("content");
    ratingList.push("pacing");
    ratingList.push("balance");
    ratingList.push("ui_ux");
    ratingList.push("impression");
}