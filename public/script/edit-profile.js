document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-btn");
    var span = document.getElementsByClassName("close-button")[0];
    var form = document.getElementById("editProfileForm");

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


function toggleOptions(button) {
    var optionsPopup = button.querySelector('.options-popup');
    if (optionsPopup.style.display === 'block') {
        optionsPopup.style.display = 'none';
    } else {
        optionsPopup.style.display = 'block';
    }
}


function deleteReview(deleteButton) {
    var review = deleteButton.closest('.review');
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            review.remove();
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your review has been deleted.',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}

function openEditProfileModal() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-profile-popup");
    var form = document.getElementById("editProfileForm");

    btn.onclick = function() {
        preFillEditProfileForm(); 
        modal.style.display = "block"; 
    };

    form.onsubmit = function(event) {
        event.preventDefault();

        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        var bio = document.getElementById("bio").value;

        document.getElementById("first-name").textContent = firstName;
        document.getElementById("last-name").textContent = lastName;
        document.getElementById("profile-bio").textContent = bio;

        var fileInput = document.getElementById("profilePic");
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profile-pic").src = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }

        modal.style.display = "none"; 
    };
}

//edit review

function editReview() {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Edited review is now published.',
        showConfirmButton: false,
        timer: 2500 
    });
}


var editReviewPopup = document.getElementById("editReviewPopup");

var editButton = document.getElementById("editButton");

var closeEditPopup = document.getElementById("closeEditPopup");

editButton.onclick = function() {
    editReviewPopup.style.display = "block";
}

closeEditPopup.onclick = function() {
    editReviewPopup.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == editReviewPopup) {
        editReviewPopup.style.display = "none";
    }
}




