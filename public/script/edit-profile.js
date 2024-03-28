document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-btn"); // Correct button selection
    var span = document.getElementsByClassName("close-button")[0];
    var form = document.getElementById("editProfileForm");

    if (btn == null) return;

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
    var currentBio = document.getElementById("bio").textContent;

    document.getElementById("firstName").value = currentFirstName;
    document.getElementById("lastName").value = currentLastName;
    document.getElementById("profileBio").value = currentBio;
}

// function openEditProfileModal() {
//     var modal = document.getElementById("editProfileModal");
//     var btn = document.querySelector(".edit-btn"); // Correct button selection
//     var form = document.getElementById("editProfileForm");

//     btn.onclick = function() {
//         preFillEditProfileForm();
//         modal.style.display = "block";
//     };
// }

// function submitEdit() {
//     var form = document.getElementById("editProfileForm");

//     form.onsubmit = function(event) {
//         event.preventDefault(); // Prevent default form submission

//         var firstName = document.getElementById("firstName").value;
//         var lastName = document.getElementById("lastName").value;
//         var profileBio = document.getElementById("profileBio").value;

//         // Display confirmation dialog using SweetAlert
//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'Do you want to save these changes to your profile?',
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes, save it!'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Perform profile update logic here
//                 // Update profile fields
//                 document.getElementById("first-name").textContent = firstName;
//                 document.getElementById("last-name").textContent = lastName;
//                 document.getElementById("bio").textContent = profileBio;

//                 // Update profile picture if provided
//                 var fileInput = document.getElementById("profilePic");
//                 if (fileInput.files && fileInput.files[0]) {
//                     var reader = new FileReader();
//                     reader.onload = function(e) {
//                         document.getElementById("profile-pic").src = e.target.result;
//                     };
//                     reader.readAsDataURL(fileInput.files[0]);
//                 }

//                 // Hide modal after successful update
//                 var modal = document.getElementById("editProfileModal");
//                 modal.style.display = "none";

//                 // Show success message using SweetAlert
//                 Swal.fire(
//                     'Saved!',
//                     'Your profile has been updated.',
//                     'success'
//                 );

//                 return false; // Prevent form submission
//             }
//         });
//     };
// }


function openEditProfileModal() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-btn"); // Correct button selection
    var form = document.getElementById("editProfileForm");

    btn.onclick = function() {
        preFillEditProfileForm();
        modal.style.display = "block";
    };

    form.onsubmit = function(event) {
        event.preventDefault(); // Prevent default form submission

        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        var profileBio = document.getElementById("profileBio").value;

        // Display confirmation dialog using SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save these changes to your profile?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Perform profile update logic here
                // Update profile fields
                document.getElementById("first-name").textContent = firstName;
                document.getElementById("last-name").textContent = lastName;
                document.getElementById("bio").textContent = profileBio;

                // Update profile picture if provided
                var fileInput = document.getElementById("profilePic");
                if (fileInput.files && fileInput.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById("profile-pic").src = e.target.result;
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }

                // Hide modal after successful update
                modal.style.display = "none";

                // Show success message using SweetAlert
                Swal.fire(
                    'Saved!',
                    'Your profile has been updated.',
                    'success'
                );
            }
        });
    };
}

