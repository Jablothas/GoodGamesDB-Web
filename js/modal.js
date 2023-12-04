function dialogButtonClick() {
    let modal = document.getElementById("dialogModal");
    let span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

