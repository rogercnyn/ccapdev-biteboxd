


function togglePopup() {
    var popupContainer = document.getElementById("popupContainer");
    popupContainer.style.display = (popupContainer.style.display === "block") ? "none" : "block";
}

function logOut() {
    window.location.href = "index.html";
}

function adjustNavBar (){

    if (isLogged != 'true') {
        document.getElementById('account-icon').style.display = 'none';
    } else {
        document.getElementById('person-icon').style.opacity = '0%';
        document.getElementById('person-icon').style.pointerEvents = 'none';
    }
    
}


