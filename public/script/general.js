let isLogged = getUrlParameter('isLogged');


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


function toggleSeeMore(reviewId) {
    var truncateText = document.getElementById(reviewId);
    var fullText = truncateText.querySelector('.full-text');
    var seeMoreButton = truncateText.querySelector('.see-more');

    var computedDisplayStyle = window.getComputedStyle(fullText).display;

    if (computedDisplayStyle === 'none') {
        truncateText.style.maxHeight = 'none'; 
        fullText.style.display = 'inline'; 
        seeMoreButton.innerHTML = '<b>see less</b>';
    } else {
        truncateText.style.maxHeight = '60px'; 
        fullText.style.display = 'none'; 
        seeMoreButton.innerHTML = '<b>...see more</b>';
    }
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