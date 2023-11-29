function changeCover() {
    var image = document.getElementById("img-cover");
    image.src = "img/covers/placeholder.png";
}

function loadLocationsForSelect() {
    getLocationsForSelect()
        .then(locationList => {
            let selectElement = document.getElementById("location");
            for (let i = 0; i < locationList.length; i++) {
                var option = document.createElement("option");
                option.value = locationList[i]["name"];
                option.text = locationList[i]["name"];
                selectElement.add(option);
            }
            // Additional code to be executed after loading locations
        })
        .catch(error => {
            console.error('Error loading locations:', error);
        });
}

function getLocationsForSelect() {
    return fetch('php/sql_connect.php?method=get_locations')
        .then(response => response.json())
        .then(data => { 
            for (let i = 0; i < locationList.length; i++) {
                locationList.push(data[i]);
            }
            return data; 
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; 
        });
}