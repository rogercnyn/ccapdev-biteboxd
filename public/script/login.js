



function shakeBoxes() {
    document.getElementById("login-form").classList.add("make-login-small");
    document.getElementById("wrong-creds-text").classList.add("show-wrong-creds-text");
    document.getElementById("logo-text").classList.add("make-logo-text-small");
    document.getElementById("username").style.outline = "1px solid red";
    document.getElementById("password").style.outline = "1px solid red";


    var usernameBox = document.querySelector(".username-box");
    var passwordBox = document.querySelector(".password-box");

    usernameBox.classList.add("shake");
    passwordBox.classList.add("shake");

    setTimeout(function() {
        usernameBox.classList.remove("shake");
        passwordBox.classList.remove("shake");
    }, 500);



}

document.addEventListener('DOMContentLoaded', function () {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if(params.loadError === 'true') {
        shakeBoxes()
    }
});
