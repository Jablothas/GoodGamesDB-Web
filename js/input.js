function getPlaytime() {
    if(document.getElementById("steam-appid").value <= 0) return; 
    showLoader(true);
    let appid = document.getElementById("steam-appid").value;
    if(appid.length > 1) {
        notify("Searching for playtime in " + appid, "warn");
        var method = "findPlaytime";
        $.ajax({
            url: 'php/steam_api.php',
            type: 'GET',
            data: { method: method, appid: appid },
            dataType: 'text', // Change dataType to 'text'
            success: function (response) {
                var data = JSON.parse(response);
                document.getElementById("playtime").value = data + " hours";
                showLoader(false);

            },
            error: function (request, error) {
                showLoader(false);
                alert("Error Request: " + error + " - - Request: " + JSON.stringify(request));
            }
        }); 
    }
    else {
        notify("No appid found.", "warn");
    }

}

function changeCover() {
    document.getElementById('img-cover-text').innerText = '';

    // Create a file input element dynamically
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.accept = 'image/*';

    // Set up an event listener for the change event
    fileInput.addEventListener('change', function () {
        uploadImage(fileInput);
    });

    // Trigger the click event on the file input
    fileInput.click();
}

function uploadImage(input) {
    var image = document.getElementById('img-cover');

    if (input.files && input.files[0]) {
        var formData = new FormData();
        formData.append('image', input.files[0]);

        // Make an AJAX request to upload the image
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/upload.php', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                // On successful upload, update the image source
                image.src = 'img/covers/' + xhr.responseText;
                document.getElementById("img-path").value = xhr.responseText;
            } else {
                // Handle errors
                console.error('Image upload failed');
            }
        };

        xhr.send(formData);
    }
}

function checkFormByGame() {
    // Steam exclusive block
    if(checkIfSteam()) {
        playedGamesList.forEach(function (game) {
            if(game.split('=')[0] == document.getElementById("title").value) {
                let appid = document.getElementById("steam-appid");
                document.getElementById("steam-appid").value = game.split('=')[1];
                datalist.appendChild(option);
            }
        });
    }
    // Other blocks
}

function checkIfSteam() {
    let status = false;
    let input = document.getElementById("location");
    let appid = document.getElementById("steam-appid");
    let appid_label = document.getElementById("steam-appid-label");
    appid.style.display = "block";
    appid_label.style.display = "block";
    if (input) {
        let location = input.value;
        if(location == "Steam") {
            status = true;
        }
        else {
            appid.style.display = "none"; 
            appid_label.style.display = "none";
            status = false;
        }
    }
    return status;
}

function setRecordStatus() {
    let score_container = document.getElementById("main-score-container");
    let modal_container = document.getElementById("modal-content");
    let endDate = document.getElementById("end_date");
    let status = document.getElementById("status").value;
    if(status == "Playing") { 
        endDate.disabled = true; 
        endDate.style.color = "grey"; 
        score_container.style.display = 'none'; 
        modal_container.style.width = "800px";
    }
    if(status == "Canceled" || status == "Completed" || status == "Endless") { 
        endDate.disabled = false; 
        endDate.style.color = "#fff";
        score_container.style.display = 'flex';  
        modal_container.style.width = "1410px";
    }
}

function updateSlider(sliderId) {
    // Get the value of the specified slider
    var sliderValue = document.getElementById(sliderId).value;
    // Update the span element with the slider value
    document.querySelector("#" + sliderId + " + .slider-value").innerText = sliderValue;
}

function disableSlider(sliderId) {
    var slider = document.getElementById(sliderId);
    var checkbox = document.getElementById(sliderId + "_check");

    // Check if the checkbox is checked
    if (!checkbox.checked) {
        // If checked, disable the slider and set its value to 0
        slider.disabled = true;
        slider.value = 0;

        // Update the span element with the slider value
        document.querySelector("#" + sliderId + " + .slider-value").innerText = 0;
    } else {
        // If unchecked, enable the slider and set its value to 1
        slider.disabled = false;
        slider.value = 1;

        // Update the span element with the slider value
        document.querySelector("#" + sliderId + " + .slider-value").innerText = 1;
    }
}

function cleanForm() {
    document.getElementById('img-cover-text').innerText = 'Upload';
    document.getElementById('img-cover').src = "img/covers/default.png";
    document.getElementById('location').value = locationList[0];
    document.getElementById("replay").value = 'No';
    document.getElementById("status").value = 'Playing'
    setRecordStatus();
    document.getElementById("steam-appid").value = '';
    document.getElementById("title").value = '';
    document.getElementById("start_date").value = getCurrentDate();
    document.getElementById("end_date").value = "TT.MM.YYYY";
    document.getElementById("playtime").value = 0;
    document.getElementById("note").value = '';
    ratingList.forEach((element) => {
        document.getElementById("slider_" + element).value = 1,
        document.getElementById(element + "_value").innerHTML = "1",
        document.getElementById("slider_" + element + "_check").checked = true
    });
}

function saveNewEntry() {
    let cover = document.getElementById("img-path").value;
    let title = document.getElementById("title").value;
    let location = document.getElementById("location").value;
    let replay = document.getElementById("replay").value;
    let status = document.getElementById("status").value;
    let steamAppid = document.getElementById("steam-appid").value;
    let date_start = document.getElementById("start_date").value;
    let date_end = document.getElementById("end_date").value;
    let playtime = document.getElementById("playtime").value;
    let note = document.getElementById("note").value;
    let gameplay = document.getElementById("gameplay_value").innerHTML
    let presentation = document.getElementById("presentation_value").innerHTML
    let narrative = document.getElementById("narrative_value").innerHTML
    let quality = document.getElementById("quality_value").innerHTML
    let sound = document.getElementById("sound_value").innerHTML
    let content = document.getElementById("content_value").innerHTML
    let pacing = document.getElementById("pacing_value").innerHTML
    let balance = document.getElementById("balance_value").innerHTML
    let ui_ux = document.getElementById("ui_ux_value").innerHTML
    let impression = document.getElementById("impression_value").innerHTML
    let scoreList = [];
    scoreList.push(gameplay,
        presentation,
        narrative,
        quality,
        sound,
        content,
        pacing,
        balance,
        ui_ux,
        impression)
    let sum = calcScore(scoreList);
    if(status == "Playing") date_end = "9999-01-01";
    if(replay == "Yes") searchForEntry(title);
    let data = {
        cover: cover,
        title: title,
        location: location,
        replay: replay,
        status: status,
        steamAppid: steamAppid,
        date_start: date_start,
        date_end: date_end,
        playtime: playtime,
        note: note,
        gameplay: gameplay,
        narrative: narrative,
        quality: quality,
        sound: sound,
        content: content,
        pacing: pacing,
        balance: balance, 
        ui_ux: ui_ux,
        impression: impression,
        sum: sum
    };
    sqlRequest(data);
}

function sqlRequest(data) {
        // Convert data object to JSON
        let jsonData = JSON.stringify(data);
        // Create a new XMLHttpRequest object
        let xhr = new XMLHttpRequest();
        // Specify the type of request (POST) and the URL of your PHP backend
        xhr.open("POST", "php/sql_write.php", true);
        // Set the request header to indicate that the content type is JSON
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // Set the callback function to handle the response from the server
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // The response from the server (if any) is available in xhr.responseText
                console.log(xhr.responseText);
            }
        };
        // Send the JSON data to the server
        xhr.send(jsonData);
}

function searchForEntry(title) {
    // work in progress
}

function calcScore(scoreList) {
    let editedScoreList = [];
    let sum = 0;
    console.log("before: " + scoreList);
    scoreList.forEach(element => {
        element = calcScoreCheck(element);
        editedScoreList.push(element);
    })
    console.log("after: " + editedScoreList);
    editedScoreList.forEach(element => {
        sum = parseInt(sum) + parseInt(element);
    })
    return parseInt(sum);
}

function calcScoreCheck(value) {
    if(value == 0) value = 10;
    return value;
}