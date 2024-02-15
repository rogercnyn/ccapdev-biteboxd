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

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('review-edit-icon')) {
            console.log('Edit review icon clicked');
            // to be Implemented
        }

        if (event.target.classList.contains('delete-recent-activity-icon')) {
            if (confirm('Are you sure you want to delete this activity?')) {
                var reviewPanel = event.target.closest('.review-panel');
                if (reviewPanel) {
                    reviewPanel.parentElement.remove();
                    alert("Review deleted!");
                }
            }
        }
    });
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

// delete review
function deleteReview(deleteButton) {
    var review = deleteButton.closest('.review');
    var confirmDelete = confirm("Are you sure you want to delete this review?");
    
    if (confirmDelete) {
        review.remove();
    }
}

//edit review

function editReview() {
    alert("Edited review published!");
}

function openEditProfileModal() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-profile-popup");
    var form = document.getElementById("editProfileForm");

    // Click event handler for the edit button
    btn.onclick = function() {
        preFillEditProfileForm(); // Prefill the edit profile form with existing data
        modal.style.display = "block"; // Display the modal
    };

    // Submit event handler for the edit profile form
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

        modal.style.display = "none"; // Close the modal after submitting the form
    };
}

// Get the edit review popup
var editReviewPopup = document.getElementById("editReviewPopup");

// Get the button that opens the edit review popup
var editButton = document.getElementById("editButton");

// Get the <span> element that closes the edit review popup
var closeEditPopup = document.getElementById("closeEditPopup");

// When the user clicks the button, open the edit review popup
editButton.onclick = function() {
    editReviewPopup.style.display = "block";
}

// When the user clicks on <span> (x), close the edit review popup
closeEditPopup.onclick = function() {
    editReviewPopup.style.display = "none";
}

// When the user clicks anywhere outside of the edit review popup, close it
window.onclick = function(event) {
    if (event.target == editReviewPopup) {
        editReviewPopup.style.display = "none";
    }
}




