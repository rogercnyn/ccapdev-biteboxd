



function shakeBoxes() {
    var usernameBox = document.querySelector(".username-box");
    var passwordBox = document.querySelector(".password-box");

    usernameBox.classList.add("shake");
    passwordBox.classList.add("shake");

    setTimeout(function() {
        usernameBox.classList.remove("shake");
        passwordBox.classList.remove("shake");
    }, 500);
}