function getPlaytime() {
    if(document.getElementById("steam-appid").value <= 0) return; 
    showLoader(true);
    let appid = document.getElementById("steam-appid").value;
    if(appid.length > 1) {
        var method = "findPlaytime";
        $.ajax({
            url: 'php/steam_api.php',
            type: 'GET',
            data: { method: method, appid: appid },
            dataType: 'text', // Change dataType to 'text'
            success: function (response) {
                var data = JSON.parse(response);
                document.getElementById("playtime").value = data;
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
                //datalist.appendChild(option);
            }
        });
    }
}

function checkIfRecordAlreadyExist() {
    for (let i = 0; i < recordList.length; i++) {
        if(recordList[i]["name"] == document.getElementById("title").value 
        && document.getElementById("status").value != "Playing"
        && recordList[i]["sum_total"] > 0) {
            updateForm(recordList[i]);
            notify("Previous record for this game found: Scores imported.", "success");
            break;
        }
    }
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

function disableStartDate() {
    let field = document.getElementById("start_date");
    if(document.getElementById("no_start_date").checked == false) {
        field.disabled = true; 
        field.style.color = "grey"; 
        field.value = '';
    }
    else {
        field.disabled = false; 
        field.style.color = "#fff";
        field.value = getCurrentDate(); 
    }

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
    document.getElementById("cancelButton").style.visibility = 'visible';
    document.getElementById("cancelButton").style.backgroundColor = '#fff';
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
    document.getElementById("saveButton").innerHTML = "Save";
    let record_id = document.getElementById("record-id").value;
    let score_id = document.getElementById("score-id").value;
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
        record_id: record_id,
        score_id: score_id,
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
        presentation: presentation,
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
    // Exception handling
    if(status == "Completed" || status == "Canceled" || status == "Endless") {
        if(document.getElementById("end_date").value == '') {
            notify("Please set an ending date.", "warn");
            document.getElementById("end_date").focus();
            return;
        }
    }
    if(document.getElementById("title").value == '') {
        notify("Please name your record.", "warn");
        document.getElementById("title").focus();
        return;
    }
    if(document.getElementById("title").value == '') {
        notify("Please name your record.", "warn");
        document.getElementById("title").focus();
        return;
    }
    if(document.getElementById("img-cover").src.includes('default.png')) {
        notify("Please upload a cover.", "warn");
        document.getElementById("img-cover").focus();
        return;
    }
    // finally pass to backend
    try {
        sqlRequest(data)
        .then(() => {
            let modal = document.getElementById("dialogModal");
            modal.style.display = "none";
            filter = "std";
            let updateMsg;
            if(editMode === false) updateMsg = data["title"] +  'saved to database';
            if(editMode === true)  updateMsg = data["title"] + ' has been updated';
            editMode = false;
            localStorage.setItem('playedGamesList', JSON.stringify(playedGamesList));
            localStorage.setItem('updateMsg', JSON.stringify(updateMsg));
        })
        .then(() => {
            // Reload the page only after updating playedGamesList
            window.location.href = window.location.href;
        })
        .catch(error => {
            console.error("Error:", error);
            notify("Something went terribly wrong: " + error.message, "warn");
        }); 
    } catch (error) {
        console.error("Error in try block:", error);
        notify("Something went terribly wrong...", "warn");
    }
}

function sqlRequest(data) {
    return new Promise((resolve, reject) => {
        // Convert data object to JSON
        let jsonData = JSON.stringify(data);
        // Create a new XMLHttpRequest object
        let xhr = new XMLHttpRequest();
        // Specify the type of request (POST) and the URL of your PHP backend
        if(editMode === false) xhr.open("POST", "php/sql_write.php", true);
        if(editMode === true) xhr.open("POST", "php/sql_update.php", true);
        // Set the request header to indicate that the content type is JSON
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // Set the callback function to handle the response from the server
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // The response from the server (if any) is available in xhr.responseText
                    console.log(xhr.responseText);
                    resolve(xhr.responseText); // Resolve the promise on success
                } else {
                    // Reject the promise on failure
                    reject(new Error("Failed to make the request. Status: " + xhr.status));
                }
            }
        };
        // Send the JSON data to the server
        xhr.send(jsonData);
    });
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


function updateForm(record) {
    let score_container = document.getElementById("main-score-container");
    let modal_container = document.getElementById("modal-content");

    document.getElementById("img-cover").src = "img/covers/" + record['cover_img_path'];
    document.getElementById("title").value = record['name'];
    document.getElementById("location").value = locationList[record['location']-1]['name'];
    document.getElementById("record-id").value = record["record_id"];
    document.getElementById("score-id").value = record["score_id"];

    // Input replay
    let replay = record['replay'];
    if(replay == "YES") replay = "Yes";
    if(replay == "NO") replay = "No";
    document.getElementById("replay").value = replay;

    // Input status
    let status = record['status'];
    let status_field = document.getElementById("status");
    let date_end_field = document.getElementById("end_date");

    if(status == "PLAYING") { status = "Playing"; }
    if(status == "COMPLETED") { 
        status = "Completed"; date_end_field.disabled = false; date_end_field.style.color = "#fff"; score_container.style.display = "flex"; modal_container.style.width = "1410px"; }
    if(status == "ENDLESS") { 
        status = "Endless"; date_end_field.disabled = false; date_end_field.style.color = "#fff"; score_container.style.display = "flex"; modal_container.style.width = "1410px"; }
    if(status == "CANCELED") { 
        status = "Canceled"; date_end_field.disabled = false; date_end_field.style.color = "#fff"; score_container.style.display = "flex"; modal_container.style.width = "1410px"; }
    status_field.value = status;

    document.getElementById("steam-appid").value = record["steam_appid"];
    document.getElementById("start_date").value = record["date_start"];
    document.getElementById("end_date").value = record["date_end"];
    if(status == "Playing") document.getElementById("end_date").value = '';

    document.getElementById("playtime").value = record['playtime'];
    document.getElementById("note").value = record['note'];

    // Gameplay score
    document.getElementById("slider_gameplay").value = record['gameplay'];
    document.getElementById("gameplay_value").innerHTML = record['gameplay'];
    if (record['gameplay'] === 0) { 
        document.getElementById("slider_gameplay_check").checked = false; 
        document.getElementById("gameplay_value").innerHTML = 0; 
    }

    // Presentation score
    document.getElementById("slider_presentation").value = record['presentation'];
    document.getElementById("presentation_value").innerHTML = record['presentation'];
    if (record['presentation'] === 0) { 
        document.getElementById("slider_presentation_check").checked = false; 
        document.getElementById("presentation_value").innerHTML = 0; 
    }

    // Narrative score
    document.getElementById("slider_narrative").value = record['narrative'];
    document.getElementById("narrative_value").innerHTML = record['narrative'];
    if (record['narrative'] === 0) { 
        document.getElementById("slider_narrative_check").checked = false; 
        document.getElementById("narrative_value").innerHTML = 0; 
    }

    // Quality score
    document.getElementById("slider_quality").value = record['quality'];
    document.getElementById("quality_value").innerHTML = record['quality'];
    if (record['quality'] === 0) { 
        document.getElementById("slider_quality_check").checked = false; 
        document.getElementById("quality_value").innerHTML = 0; 
    }

    // Sound score
    document.getElementById("slider_sound").value = record['sound'];
    document.getElementById("sound_value").innerHTML = record['sound'];
    if (record['sound'] === 0) { 
        document.getElementById("slider_sound_check").checked = false; 
        document.getElementById("sound_value").innerHTML = 0; 
    }

    // Content score
    document.getElementById("slider_content").value = record['content'];
    document.getElementById("content_value").innerHTML = record['content'];
    if (record['content'] === 0) { 
        document.getElementById("slider_content_check").checked = false; 
        document.getElementById("content_value").innerHTML = 0; 
    }

    // Pacing score
    document.getElementById("slider_pacing").value = record['pacing'];
    document.getElementById("pacing_value").innerHTML = record['pacing'];
    if (record['pacing'] === 0) { 
        document.getElementById("slider_pacing_check").checked = false; 
        document.getElementById("pacing_value").innerHTML = 0; 
    }

    // Balance score
    document.getElementById("slider_balance").value = record['balance'];
    document.getElementById("balance_value").innerHTML = record['balance'];
    if (record['balance'] === 0) { 
        document.getElementById("slider_balance_check").checked = false; 
        document.getElementById("balance_value").innerHTML = 0; 
    }

    // UI/UX score
    document.getElementById("slider_ui_ux").value = record['ui_ux'];
    document.getElementById("ui_ux_value").innerHTML = record['ui_ux'];
    if (record['ui_ux'] === 0) { 
        document.getElementById("slider_ui_ux_check").checked = false; 
        document.getElementById("ui_ux_value").innerHTML = 0; 
    }

    // Impression score
    document.getElementById("slider_impression").value = record['impression'];
    document.getElementById("impression_value").innerHTML = record['impression'];
    if (record['impression'] === 0) { 
        document.getElementById("slider_impression_check").checked = false; 
        document.getElementById("impression_value").innerHTML = 0; 
    }
    if(record["date_start"] == ''  || record["date_start" === null]) {
        let field_date = document.getElementById("start_date");
        let field_checkmark = document.getElementById("no_start_date");
        field_date.checked = false;
        field_date.disabled = true; 
        field_date.style.color = "grey"; 
        field_date.value = '';
        field_checkmark.checked = false;


    }
    document.getElementById("img-path").value = record['cover_img_path'];
    document.getElementById("saveButton").innerHTML = "Save changes";
    document.getElementById("cancelButton").style.visibility = 'hidden';
}