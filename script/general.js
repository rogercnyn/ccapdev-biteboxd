let isLogged = getUrlParameter('isLogged');


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



function transferSession(link) {
    if(isLogged === 'true'){
        link = appendQueryParameter(link, 'isLogged', 'true');
    } 
    window.location.href = link
}

function appendQueryParameter(url, paramName, paramValue) {
    // Check if the URL already contains query parameters
    const separator = url.includes('?') ? '&' : '?';

    // Construct the new URL with the query parameter appended
    const newUrl = `${url}${separator}${paramName}=${paramValue}`;

    return newUrl;
}


function togglePasswordVisibility() {
    var passwordField = document.getElementById("password");
    var showPasswordIcon = document.getElementById("show-password");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        showPasswordIcon.classList.add("show-password-clicked")
    } else {
        showPasswordIcon.classList.remove("show-password-clicked")

        passwordField.type = "password";
    }
}