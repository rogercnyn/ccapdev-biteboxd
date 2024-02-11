function checkLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    if (username === "makoeats" && password === "meowmeow") {
        window.location.href = "index.html?isLogged=true"
    } else {
        document.getElementById("login-form").classList.add("make-login-small");
        document.getElementById("wrong-creds-text").classList.add("show-wrong-creds-text");
        document.getElementById("logo-text").classList.add("make-logo-text-small");
        document.getElementById("username").style.outline = "1px solid red";
        document.getElementById("password").style.outline = "1px solid red";
        shakeBoxes();
    }
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