// globals
var recordList = [];
var locationList = [];

function start() {
    getLocations();
    getRecords();
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
  for (let record of recordList) {
      document.body.appendChild(createPanelBody(record));
  }
}

function notify(msg, type) {
    $.notify("" + msg,  type, 
        { position:"right bottom" }
      );
}