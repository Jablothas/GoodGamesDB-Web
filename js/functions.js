// globals
var recordList = [];

// functions
function getData() {
  fetch('php/sql_connect.php')
      .then(response => response.json())
      .then(data => { 
          for (let i = 0; i < data.length; i++) {
              recordList.push(data[i]);
          }
          buildGrid();
          buildGrid();
          buildGrid();
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