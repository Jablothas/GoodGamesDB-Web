// globals
var contentMaster = document.createElement('div');
var recordList = [];
var locationList = [];
var playedGamesList = [];
var filter = "std";
var keyword = "";

function start() {
    getLocations();
    getRecords();
    findPlayedGames();
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

function loopRecords() {
    for (let record of recordList) {
        contentMaster.appendChild(createPanelBody(record));
    }
    document.body.appendChild(contentMaster);    
}

function addButtonClick() {
    let modal = document.getElementById("dialogModal");
    let span = document.getElementsByClassName("close")[0];
    modal.style.display = "inline-block";
    inputCleanUp();
    var selectElement = document.getElementById("location");
    selectElement.innerHTML = '';
    locationList.forEach(function (location) {
      var option = document.createElement("option");
      option.text = location.name;
      selectElement.appendChild(option);
    });
    document.getElementById("location").focus();
    span.onclick = function() {
        modal.style.display = "none";
    }
}

function logoutButtonClick() {
        notify("Logout is forbidden.", "error");
    }


function notify(msg, type) {
    $.notify("" + msg,  type, 
        { position:"right bottom" }
      );
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

function inputCleanUp() {
    document.getElementById("title").value = '';
    document.getElementById("steam-appid").value = '';
}

/*
function getPlaytime() {
    var game = document.getElementById("title").value;
    var method = "std-fetch";
    $.ajax({
      url : 'php/steam_api.php',
      type : 'GET',
      data: {data1: method, data2: game},
      dataType:'json',
      success : function(data) {              
        //var arr = JSON.stringify(data).replace("\"", "").split("-");
        //document.getElementById("playtime").value = arr[0];
        //appid = parseInt(arr[1]);
        notify(data);
      },
      error : function(request,error)
      {
          alert("error Request: " + error + " - - request: " + JSON.stringify(request));
      }
    });
}*/