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