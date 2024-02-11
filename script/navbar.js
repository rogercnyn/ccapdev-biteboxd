


function togglePopup() {
    var popupContainer = document.getElementById("popupContainer");
    popupContainer.style.display = (popupContainer.style.display === "block") ? "none" : "block";
}

function logOut() {
    let updatedUrl = window.location.href.replace('isLogged=true', '');

    window.location.href = updatedUrl;
}

function adjustNavBar (){

    if (isLogged != 'true') {
        document.getElementById('account-icon').style.display = 'none';
    } else {
        document.getElementById('person-icon').style.opacity = '0%';
        document.getElementById('person-icon').style.pointerEvents = 'none';
    }
    
}



function transferSession(link) {
    if(isLogged === 'true'){
        link += '?isLogged=true'
    } 
    window.location.href = link
}
