document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-btn");
    var span = document.getElementsByClassName("close-button")[0];
    var form = document.getElementById("editProfileForm");

    if(btn == null) return;

    btn.onclick = function() {
        preFillEditProfileForm();
        modal.style.display = "block";
    };

    span.onclick = () => modal.style.display = "none";
    window.onclick = event => {
        if (event.target == modal) modal.style.display = "none";
    };

    var fileInput = document.getElementById("profilePic");
    fileInput.onchange = function() {
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profile-pic").src = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    };
});


function preFillEditProfileForm() {
    var currentUsername = document.getElementById("profile-username").textContent.replace('@', '');
    var currentFirstName = document.getElementById("first-name").textContent;
    var currentLastName = document.getElementById("last-name").textContent;
    var currentBio = document.getElementById("profile-bio").textContent;

    document.getElementById("firstName").value = currentFirstName;
    document.getElementById("lastName").value = currentLastName;
    document.getElementById("bio").value = currentBio;
}


function toggleOptions(element) {
    $(element).next('.options-popup').toggle()
}


//edit review

document.addEventListener('DOMContentLoaded', function() {


});





// var editReviewPopup = document.getElementById("editReviewPopup");

// var editButton = document.getElementById("editButton");

// var closeEditPopup = document.getElementById("closeEditPopup");

// editButton.onclick = function() {
//     editReviewPopup.style.display = "block";
// }

// closeEditPopup.onclick = function() {
//     editReviewPopup.style.display = "none";
// }

// window.onclick = function(event) {
//     if (event.target == editReviewPopup) {
//         editReviewPopup.style.display = "none";
//     }
// }




