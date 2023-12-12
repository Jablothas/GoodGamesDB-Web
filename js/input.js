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
    var image = document.getElementById("img-cover");
    image.src = "img/covers/placeholder.png";
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
    let endDate = document.getElementById("end_date");
    let status = document.getElementById("status").value;
    if(status == "Playing") { endDate.disabled = true; endDate.style.color = "grey"; }
    if(status == "Canceled" || status == "Completed") { endDate.disabled = false; endDate.style.color = "#fff"; }
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