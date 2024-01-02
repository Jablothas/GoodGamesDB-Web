var isReplay = false;
var currentYear;
var afterReload = false;



function createPanelBody(record) {
    let url = `url('${setRecordBackground(record["location_name"])}')`;
    checkForSpacer(new Date(record["date_end"]).getFullYear());
    setReplayStatus(record["replay"]);
    // Main container
    let container = document.createElement('div');
    container.id = record["record_id"];
    container.className = "panel-container";
    // Front panel
    let frontPanel = document.createElement('div');
    frontPanel.className = "front-panel";
    // Back panel
    let backPanel = document.createElement('div');
    backPanel.className = "back-panel";
    // Append front and back panels to the main container
    container.appendChild(frontPanel);
    container.appendChild(backPanel);
    // Toggle the flipped class on click
    container.addEventListener("click", () => {
        container.classList.toggle('flipped');
    });
    frontPanel.appendChild(addInnerContent("front", record));
    frontPanel.style.backgroundImage = url;
    backPanel.appendChild(addInnerContent("back", record));
    return container;
}

function addInnerContent(x, record) {
    let container = document.createElement('div');
    if(x === "front") {
        container.className = "panel-content-inner-front";
        let leftPanel = document.createElement('div');
        leftPanel.appendChild(addImage(record["cover_img_path"]));
        leftPanel.className = "panel-content-left"
        let rightPanel = document.createElement('div');
        rightPanel.className = "panel-content-right";
        rightPanel.appendChild(renderData(record));
        container.appendChild(leftPanel);
        container.appendChild(rightPanel);
    }
    if(x === "back") {
        // Header <TITLE>       -       <STATUS>
        let header = document.createElement('div');
        header.className = "panel-header-back";
        // Title
        let title = document.createElement('div');
        title.className = "title";
        title.textContent = record["name"];
        // Edit button
        let editButton = document.createElement('button');
        editButton.className = "panel-back-edit";
        editButton.addEventListener("click", (event) => {
            openRecord(record);
        });
        // Score display
        createScoreDisplay(record["sum_total"]);
        header.appendChild(title);
        container.appendChild(header);
        container.appendChild(createScoreDisplay(record["sum_total"]));
        container.appendChild(renderDataBackPanel(record));
        header.appendChild(editButton);
    }
    return container;
}

function renderData(record) {
    // Check if this a currently running record
    let recordStatus = record["status"]
    // Main container
    var container = document.createElement('div');
    container.className = "panel-content-front";
    // Header <TITLE>       -       <STATUS>
    var header = document.createElement('div');
    header.className = "panel-header-front";
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
    container.appendChild(setDates(record["date_start"], record["date_end"], record["status"]));
    if(record["note"] != "") container.appendChild(setNote(record["note"]));
    return container;
}

function renderDataBackPanel(record) {
    let container = document.createElement('div');
    container.className = "panel-container-back";
    let innerParent = document.createElement('div');
    let leftTitle = document.createElement('div');
    leftTitle.textContent = "In-depth scoring";
    leftTitle.className = "panel-content-back-title-scores";
    let innerChildCol1 = document.createElement('div');
    let innerChildCol2 = document.createElement('div');
    container.appendChild(leftTitle);
    innerParent.appendChild(innerChildCol1);
    innerParent.appendChild(innerChildCol2);
    innerChildCol1.appendChild(createSingleScore("Gameplay", record["gameplay"], record["status"]));
    innerChildCol1.appendChild(createSingleScore("Presentation", record["presentation"], record["status"]));
    innerChildCol1.appendChild(createSingleScore("Narrative", record["narrative"], record["status"]));
    innerChildCol1.appendChild(createSingleScore("Quality", record["quality"], record["status"]));
    innerChildCol1.appendChild(createSingleScore("Sound", record["sound"], record["status"]));
    innerChildCol2.appendChild(createSingleScore("Content", record["content"], record["status"]));
    innerChildCol2.appendChild(createSingleScore("Pacing", record["pacing"], record["status"]));
    innerChildCol2.appendChild(createSingleScore("Balance", record["balance"], record["status"]));
    innerChildCol2.appendChild(createSingleScore("UI/UX", record["ui_ux"], record["status"]));
    innerChildCol2.appendChild(createSingleScore("Impression", record["impression"], record["status"]));
    innerParent.appendChild(addStats(record));
    innerParent.className = "panel-content-back-parent";
    container.appendChild(innerParent);
    return container;
}

function createSingleScore(name, score, status) {
    let container = document.createElement('div');
    container.className = "single-score";
    let digit = document.createElement('div');
    digit.className = "single-score-digit";
    digit.textContent = score;
    let text = document.createElement('div');
    text.className = "single-score-text";
    text.textContent = name;
    if(status === "PLAYING") digit.textContent = "?";
    if(score == "0") { digit.style.color = "grey"; text.style.color = "grey"; }
    container.appendChild(digit);
    container.appendChild(text);
    return container;
}

function addStats(record) {
    let container = document.createElement('div');
    container.className = "stats";
    container.appendChild(addStatsRow(12, "days", "Time past since start"));
    container.appendChild(addStatsRow(1144, "hours",  "Total playtime"));
    container.appendChild(addStatsRow(1, "time", "Total playthroughs"));
    return container;
}

function addStatsRow(number, unit, title) {
    let row = document.createElement('div');
    row.className = "stats-row";
    let stat_title = document.createElement('div');
    stat_title.textContent = title;
    stat_title.className = "stats-title"
    let digit = document.createElement('div');
    digit.textContent = number + " " + unit;
    digit.className = "stats-digit";
    row.appendChild(stat_title);
    row.appendChild(digit);
    return row;
}

function openRecord(record) {
    editMode = true;
    addButtonClick(record);
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
    date_start_icon.src = "img/icons/date_start.png";
    if(date1 != '') {
        date_start.textContent = new Date(date1).toLocaleDateString("en-DE", date_options);
    } else {
        date_start.textContent = "--";
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
        //date_start.textContent = "--"
        date_end.textContent = new Date(date2).toLocaleDateString("en-DE", date_options);
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
    coverImage.className = "cover-image";
    coverImage.src = "img/covers/" + img;
    return coverImage;
}

function createScoreDisplay(sum) {
    var scoreContainer = document.createElement('div');
    scoreContainer.className = "scores";
    // score element
    var score = document.createElement('div');
    score.className = "display-score";
    score.textContent = sum;
    scoreContainer.appendChild(score);
    // Change color based on value
    if(sum >= 80) score.style.color = "limegreen";
    else if(sum >= 70) score.style.color = "yellowgreen";
    else if(sum >= 61) score.style.color = "yellow";
    else score.style.color = "#C70000";
    if(sum == 0) {
        score.style.color = "grey";
        score.textContent = "-";
    }
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
    icon.className = "title-status-icon";
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
        case 'ENDLESS':
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
    if(year === 9999) spacer.textContent = "Currently Playing";
    if(firstSpacer) spacer.style.marginTop = "110px";
    contentMaster.appendChild(spacer);
}

function checkForSpacer(year) {
    if(currentYear == null) {
        currentYear = year;
        createSpacer(currentYear, true)
    }
    
    if(currentYear != year) {
        currentYear = year;
        createSpacer(currentYear, false)
    }
}

function createPanelBody2(record) {
    //if(afterReload) { currentYear = null; afterReload = false }
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
    mainPanel.style.backgroundImage = url;
    mainPanel.addEventListener("click", (event) => {
        //openRecord(record);
        mainPanel.classList.toggle('flipped');
    });
    return mainPanel;
}