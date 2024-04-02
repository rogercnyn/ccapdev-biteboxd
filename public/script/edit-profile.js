document.addEventListener('DOMContentLoaded', function() {
    var profileModal = document.getElementById("editProfileModal");
    var tasteModal = document.getElementById("editTasteProfileModal");

    // Simplify modal opening with a function
    function setupModalOpen(button, modal, preFillFunction) {
        if (button) {
            button.addEventListener('click', function() {
                if (preFillFunction) preFillFunction(); // Call pre-fill function if provided
                modal.style.display = "block";
            });
        }
    }

    setupModalOpen(document.querySelector(".edit-btn"), profileModal, preFillEditProfileForm);
    setupModalOpen(document.querySelector(".edit-taste-btn"), tasteModal, preFillEditTasteProfileForm);

    // Handling closing of modals through close buttons and outside clicks
    document.querySelectorAll('.close-button').forEach(function(span) {
        span.addEventListener('click', function() {
            span.closest('.modal').style.display = "none";
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    });

    // Set up file input previews
    function setupFileInputPreview(fileInputId, previewImgId) {
        var fileInput = document.getElementById(fileInputId);
        if (fileInput) {
            fileInput.onchange = function() {
                if (fileInput.files && fileInput.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById(previewImgId).src = e.target.result;
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            };
        }
    }

    setupFileInputPreview("profilePic", "profile-pic");
    setupFileInputPreview("tastePic", "taste-pic");

    // Submit updated taste profile
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

// function preFillEditTasteProfileForm() {
//     fetch('/profile/getTasteProfile')
//         .then(response => response.json())
//         .then(data => {
//             const { tasteProfile } = data;
//             // Clear previously selected tags
//             document.querySelectorAll('.tag.selected').forEach(tag => tag.classList.remove('selected'));
//             // Select the appropriate tags
//             tasteProfile.forEach(taste => {
//                 document.querySelectorAll('.tag').forEach(tagElement => {
//                     if (tagElement.textContent.trim() === taste) {
//                         tagElement.classList.add('selected');
//                     }
//                 });
//             });
//             console.log('Taste profile prefilled with:', tasteProfile);
//         })
//         .catch(error => {
//             console.error('Error fetching taste profile:', error);
//         });
// }


// function saveUpdatedTasteProfile() {
//     const selectedTags = document.querySelectorAll('.tag.selected');
//     const updatedTastes = Array.from(selectedTags).map(tag => tag.textContent.trim());

//     // Swal confirmation dialog
//     Swal.fire({
//         title: 'Are you sure?',
//         text: 'Do you want to save these changes to your taste profile?',
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, save it!'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             console.log('Saving updated taste profile:', updatedTastes);
            
//             // If confirmed, proceed with the fetch request
//             fetch('/profile/updateTasteProfile', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ newTasteProfile: updatedTastes }),
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Taste profile updated successfully:', data);
//                 document.getElementById("editTasteProfileModal").style.display = "none";
                
//                 // Swal success message
//                 Swal.fire(
//                     'Updated!',
//                     'Your taste profile has been updated successfully.',
//                     'success'
//                 );
//             })
//             .catch((error) => {
//                 console.error('Error updating taste profile:', error);
                
//                 // Swal error message
//                 Swal.fire(
//                     'Error!',
//                     'There was a problem updating your taste profile. Please try again.',
//                     'error'
//                 );
//             });
//         }
//     });
// }

function setupModalOpen(button, modal, preFillFunction) {
    if (button) {
        button.addEventListener('click', function() {
            modal.style.display = "block";
            // Ensure the modal is visible before calling the pre-fill function
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
            // Assuming data.tasteProfile is an array of tastes
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
                // Reload the page after a short delay to show the success alert
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
    var btn = document.querySelector(".edit-taste-btn"); // Assuming you have a button with class "edit-taste-btn" to trigger opening the modal

    btn.onclick = function() {
        preFillEditTasteProfileForm();
        modal.style.display = "block";
    };
}


function toggleTag(tag) {
    tag.classList.toggle('selected');
}

function toggleOptions(element) {
    $(element).next('.edit-options-popup').toggle()
}

