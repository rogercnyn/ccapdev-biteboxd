document.addEventListener('DOMContentLoaded', function() {
    var profileModal = document.getElementById("editProfileModal");
    var tasteModal = document.getElementById("editTasteProfileModal");

    function setupModalOpen(button, modal, preFillFunction) {
        if (button) {
            button.addEventListener('click', function() {
                if (preFillFunction) preFillFunction();
                modal.style.display = "block";
            });
        }
    }

    setupModalOpen(document.querySelector(".edit-btn"), profileModal, preFillEditProfileForm);
    setupModalOpen(document.querySelector(".edit-taste-btn"), tasteModal, preFillEditTasteProfileForm);

    var changePasswordBtn = document.querySelector(".change-btn");
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            console.log("Attempting to display modal");
            document.getElementById("changePasswordModal").style.display = "block";
            console.log("Modal display property set to block");
        });
    } else {
        console.log("Change password button not found");
    }

    var changePasswordForm = document.getElementById("changePasswordForm");
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            saveChangePassword();
        });
    }

    document.querySelectorAll('.modal .close-button').forEach(function(closeButton) {
        closeButton.addEventListener('click', function() {
            closeButton.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    });

    setupFileInputPreview("profilePic", "profile-pic");
    setupFileInputPreview("tastePic", "taste-pic");

    var saveTasteChangesButton = document.getElementById('saveTasteChanges');
    if (saveTasteChangesButton) {
        saveTasteChangesButton.addEventListener('click', saveUpdatedTasteProfile);
    }
});

function preFillEditProfileForm() {

    var currentFirstName = document.getElementById("first-name").textContent;
    var currentLastName = document.getElementById("last-name").textContent;
    var currentBio = document.getElementById("bio").textContent;

    document.getElementById("firstName").value = currentFirstName;
    document.getElementById("lastName").value = currentLastName;
    document.getElementById("profileBio").value = currentBio;
}



function openEditProfileModal() {
    var modal = document.getElementById("editProfileModal");
    var btn = document.querySelector(".edit-btn"); 
    var form = document.getElementById("editProfileForm");

    btn.onclick = function() {
        preFillEditProfileForm();
        modal.style.display = "block";
    };

    form.onsubmit = function(event) {
        event.preventDefault(); 

        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        var profileBio = document.getElementById("profileBio").value;

        
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

                document.getElementById("first-name").textContent = firstName;
                document.getElementById("last-name").textContent = lastName;
                document.getElementById("bio").textContent = profileBio;


                var fileInput = document.getElementById("profilePic");
                if (fileInput.files && fileInput.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById("profile-pic").src = e.target.result;
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }

                modal.style.display = "none";

                Swal.fire(
                    'Saved!',
                    'Your profile has been updated.',
                    'success'
                );
            }
        });
    };
}

function setupModalOpen(button, modal, preFillFunction) {
    if (button) {
        button.addEventListener('click', function() {
            modal.style.display = "block";
            setTimeout(() => {
                if (preFillFunction) preFillFunction();
            }, 0);
        });
    }
}

function preFillEditTasteProfileForm() {
    console.log('Attempting to fetch and pre-fill taste profile...');
    fetch('/profile/getTasteProfile')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch taste profile');
            return response.json();
        })
        .then(data => {
            console.log('Fetched taste profile:', data);
            const tastes = data.tasteProfile || [];
            document.querySelectorAll('.tag').forEach(tag => {
                const isSelected = tastes.includes(tag.textContent.trim());
                tag.classList.toggle('selected', isSelected);
                if (isSelected) console.log(`Selected: ${tag.textContent.trim()}`);
            });
        })
        .catch(error => console.error('Error in pre-filling the taste profile:', error));
}


function saveUpdatedTasteProfile() {
    const selectedTags = document.querySelectorAll('.tag.selected');
    const updatedTastes = Array.from(selectedTags).map(tag => tag.textContent.trim());

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save these changes to your taste profile?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('Saving updated taste profile:', updatedTastes);

            fetch('/profile/updateTasteProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newTasteProfile: updatedTastes }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Taste profile updated successfully:', data);
                Swal.fire(
                    'Updated!',
                    'Your taste profile has been updated successfully. The page will now refresh.',
                    'success'
                ).then(() => {
                    window.location.reload();
                });
            })
            .catch((error) => {
                console.error('Error updating taste profile:', error);
                Swal.fire(
                    'Error!',
                    'There was a problem updating your taste profile. Please try again.',
                    'error'
                );
            });
        }
    });
}





function openEditTasteProfileModal() {
    var modal = document.getElementById("editTasteProfileModal");
    var btn = document.querySelector(".edit-taste-btn"); 

    btn.onclick = function() {
        preFillEditTasteProfileForm();
        modal.style.display = "block";
    };
}


function toggleTag(tag) {
    tag.classList.toggle('selected');
}

function openChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'block';
}


function shakeBoxes(message) {
    var newPasswordField = document.getElementById("newPassword");
    if (newPasswordField) {
        newPasswordField.classList.add("shake", "error");
        var errorSpan = newPasswordField.nextElementSibling;
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = "block";
        }
        setTimeout(() => {
            newPasswordField.classList.remove("shake", "error");
            if (errorSpan) {
                errorSpan.textContent = "";
                errorSpan.style.display = "none";
            }
        }, 2000);
    }

    var confirmPasswordField = document.getElementById("confirmpass");
    if (confirmPasswordField) {
        confirmPasswordField.classList.add("shake", "error");
        var errorSpan = confirmPasswordField.nextElementSibling;
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = "block";
        }
        setTimeout(() => {
            confirmPasswordField.classList.remove("shake", "error");
            if (errorSpan) {
                errorSpan.textContent = "";
                errorSpan.style.display = "none";
            }
        }, 2000);
    }
}



function saveChangePassword() {
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmpass").value;

    if (!oldPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8) {
        var message = "";
        if (newPassword.length < 8) {
            message = "Password too short";
        } else {
            message = "Passwords do not match";
        }
        shakeBoxes(message);
        return;
    }

    fetch('/api/changePassword/:username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            Swal.fire(
                'Success!',
                'Your password has been changed successfully.',
                'success'
            );
            document.getElementById("changePasswordModal").style.display = "none";
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to change password',
                text: data.message,
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    });
}




function setupFileInputPreview(fileInputId, previewImgId) {
    var fileInput = document.getElementById(fileInputId);
    if (fileInput) {
        fileInput.onchange = function() {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(previewImgId).src = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        };
    }
}
