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
        document.getElementById("profile-bio").textContent =  bio;

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

    // to be continued....
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('review-edit-icon')) {
            // Implement yung logic para sa edit review
            console.log('Edit review icon clicked');
            // openEditReviewModal(event.target); --> define this after
        }

        if (event.target.classList.contains('delete-recent-activity-icon')) {
            if (confirm('Are you sure you want to delete this activity?')) {
                var activityElement = event.target.closest('.recent-activity');
                if (activityElement) {
                    activityElement.remove();
                }
            }
        }
    });
});

function preFillEditProfileForm() {
    var currentUsername = document.getElementById("profile-username").textContent.replace('@', '');
    var currentFirstName = document.getElementById("first-name").textContent;
    var currentLastName = document.getElementById("last-name").textContent;
    var currentBio = document.getElementById("profile-bio").textContent.replace('bio: ', '');

    document.getElementById("firstName").value = currentFirstName;
    document.getElementById("lastName").value = currentLastName;
    document.getElementById("bio").value = currentBio;
}

function openEditProfileModal() {
    preFillEditProfileForm(); 
    document.getElementById("editProfileModal").style.display = "block";
}
