var isReplay = false;
var currentYear;

function createPanelBody(record) {
    // Yearly spacer
    let year = new Date(record["date_end"]).getFullYear();
    if(currentYear == null) {
        currentYear = year;
        createSpacer(currentYear, true)
    }
    if(currentYear != year) {
        currentYear = year;
        createSpacer(currentYear, false)
    }
    //
    setReplayStatus(record["replay"]);
    // Main panel
    var mainPanel = document.createElement('div');
    mainPanel.id = record["record_id"];
    mainPanel.className = "mainPanel";
    // Container for left and right panels
    var panelContainer = document.createElement('div');
    panelContainer.className = "panelContainer";
    // Left side
    var leftPanel = document.createElement('div');
    // Right side
    var rightPanel = document.createElement('div');
    panelContainer.className = "rightPanel";

    // Build everything together  
    panelContainer.appendChild(leftPanel);
    panelContainer.appendChild(rightPanel);
    mainPanel.appendChild(panelContainer);

    leftPanel.appendChild(addImage(record["cover_img_path"]));
    rightPanel.appendChild(renderData(record));
    let url = `url('${setRecordBackground(record["location_name"])}')`;
    console.log(url);
    mainPanel.style.backgroundImage = url;
    mainPanel.addEventListener("click", (event) => {
        openRecord(record);
    });
    return mainPanel;
}

function renderData(record) {
    // Check if this a currently running record
    let recordStatus = record["status"]
    // Main container
    var container = document.createElement('div');
    container.className = "dataContainer";
    // Header <TITLE>       -       <STATUS>
    var header = document.createElement('div');
    header.className = "panelHeader";
    // Title
    var title = document.createElement('div');
    title.className = "title";
    title.textContent = record["name"];
    // Score display
    createScoreDisplay(record["sum_total"]);
    header.appendChild(title);
    header.appendChild(setStatus(record["status"]));
    container.appendChild(header);
    container.appendChild(createScoreDisplay(record["sum_total"]));
    // Start date
    // TODO: NEXT STEP!!!!!!!!!!!!!!!
    container.appendChild(setDates(record["date_start"], record["date_end"], record["status"]));
    if(record["note"] != "") container.appendChild(setNote(record["note"]));
    return container;
}

function openRecord(record) {
    // currently disabled until further development
    return;
    notify(record["name"] + " wurde angeklickt.", "success");
    addButtonClick()
    document.getElementById('title').value=`${record["name"]}`
}

function setDates(date1, date2, status)
{
    const date_options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
    let container = document.createElement('div');
    // Container start date
    let container_start = document.createElement('div');
    let date_start_icon = document.createElement('img');
    let date_start = document.createElement('div');
    let container_end = document.createElement('div');
    let date_end_icon = document.createElement('img');
    let date_end = document.createElement('div');
    date_end_icon.src = "img/icons/date_end2.png";
    date_end_icon.style.width = "25px";
    date_end_icon.style.height = "25px";
    if(date1 != null) {
        date_start_icon.src = "img/icons/date_start.png";
        date_start.textContent = new Date(date1).toLocaleDateString("en-GB", date_options);
    }

    if(status == "PLAYING") {
        date_end.style.color = "#ffa404";
        date_end.textContent = "in progress"
    }
    else if(status == "CANCELED") {
        date_end.style.color = "#D04444";
        date_end.textContent = "canceled"
    }
    else {
        date_start_icon.src = "img/icons/date_start.png";
        date_start.textContent = "--"
        date_end.textContent = new Date(date2).toLocaleDateString("en-GB", date_options);
    } 
    container_start.appendChild(date_start_icon);
    container_start.appendChild(date_start);
    container_end.appendChild(date_end_icon);
    container_end.appendChild(date_end);
    container.appendChild(container_start);
    container.appendChild(container_end);
    container_start.className = "dateContainer";
    container_end.className = "dateContainer";
    container.className = "dateContainerParent";
    return container;
}

function setNote(note) {
    let container = document.createElement('div');
    let container_note = document.createElement('div');
    //let container_icon = document.createElement('img');
    //container_icon.src = "img/icons/note.png";
    container_note.textContent = note;
    //container.appendChild(container_icon);
    container.appendChild(container_note);
    container.className = "noteContainerParent";
    //container_icon.className = "noteContainer";
    container_note.className = "noteContainer";
    return container;
}

function addImage(img) {
    var coverImage = document.createElement("img");
    coverImage.className = "coverImage";
    coverImage.src = "img/covers/" + img;
    return coverImage;
}

function createScoreDisplay(sum) {
    var scoreContainer = document.createElement('div');
    scoreContainer.className = "scoreContainer";
    // score element
    var score = document.createElement('div');
    score.className = "scoreDisplay";
    score.textContent = sum;
    scoreContainer.appendChild(score);
    // Change color based on value
    if(sum >= 80) score.style.backgroundColor = "#008000"
    else if(sum >= 70) score.style.backgroundColor = "#FFBE5B"
    else if(sum >= 61) score.style.backgroundColor = "#C77700"
    else score.style.backgroundColor = "#C70000"
    // medal element
    if(sum >= 85) scoreContainer.appendChild(setMedal(sum));
    if(isReplay) {
        scoreContainer.appendChild(setReplay());
    }
    return scoreContainer;
}

function setMedal(sum) {
    var medal = document.createElement('img');
    medal.className = "medal";
    if(sum >= 95) medal.src = "img/medals/gold.png";
    else if(sum >=90) medal.src = "img/medals/silver.png"
    else if(sum >= 85) medal.src = "img/medals/bronze.png"
    return medal;
}

function setReplay() {
    var icon = document.createElement('img');
    icon.className = "iconReplay";
    icon.src = "img/icons/replay.png";
    return icon;
}

function setRecordBackground(location) {
    for(let item of locationList) {
        if(item["name"].toUpperCase() == location.toUpperCase()) return "img/locations/" + item["img"];
    }
}

function setStatus(status) {
    /* Status possibilities: 
    *   COMPLETED   =>  Story has been finished
    *   PLAYING     =>  Currently playing
    *   BREAK       =>  On hold
    *   INFINITY    =>  Game without finishable story
    *   CANCELED    =>  Stopped playing
    */
    var icon = document.createElement('img');
    icon.className = "statusIcon";
    switch (status) {
        case 'COMPLETED':
            icon.src = "img/status/completed.png";
            break;  
        case 'PLAYING':
            icon.src = "img/status/playing.png";
            break;
        case 'BREAK':
            icon.src = "img/status/break.png";
            break;
        case 'INFINITY':
            icon.src = "img/status/infinity.png";
            break;
        case 'CANCELED':
            icon.src = "img/status/canceled.png";
            break;
        default: 
            icon.src = "";
            break;
    }
    return icon;
}

function setReplayStatus(replay) {
    if(replay == "YES") {
        isReplay = true;
    }
    else {
        isReplay = false;
    }
}

function createSpacer(year, firstSpacer) {
    var spacer = document.createElement('div');
    spacer.className = "spacer";
    spacer.textContent = year;
    if(firstSpacer) spacer.style.marginTop = "110px";
    contentMaster.appendChild(spacer);
}

