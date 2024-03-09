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


// function deleteReview(deleteButton) {
//     var review = deleteButton.closest('.review');
//     Swal.fire({
//         icon: 'warning',
//         title: 'Are you sure?',
//         text: 'This action cannot be undone.',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, delete it'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             review.remove();
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Deleted!',
//                 text: 'Your review has been deleted.',
//                 showConfirmButton: false,
//                 timer: 2000
//             });
//         }
//     });
// }
function deleteReview(deleteButton) {
    var review = deleteButton.closest('.review');
    var reviewId = review.dataset.reviewId; // The review ID is stored in a data attribute

    console.log("Review ID to delete:", reviewId); // This should log the correct review ID

    if (!reviewId) {
        console.error('Review ID not found!');
        Swal.fire('Error', 'Review ID not found!', 'error');
        return;
    }

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
            fetch('/deleteReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewId: reviewId }), // Sending the review ID to the server
            })
            .then(response => response.json())
            .then(data => {
                if(data.message === 'Review deleted successfully') {
                    review.remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Your review has been deleted.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
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

document.addEventListener('DOMContentLoaded', function() {

    document.body.addEventListener('click', function(event) {
        if (event.target.dataset.action === 'editReview') {
            event.preventDefault();
            const reviewElement = event.target.closest('.review');
            const reviewId = reviewElement.dataset.reviewId;

            const reviewTitle = reviewElement.querySelector('.titlearea').textContent;
            const reviewBody = reviewElement.querySelector('.longtext').textContent;

            document.getElementById('editReviewId').value = reviewId;
            document.getElementById('editTitle').value = reviewTitle.trim();
            document.getElementById('editBody').value = reviewBody.trim();

            var editModal = new bootstrap.Modal(document.getElementById('editReviewModal'));
            editModal.show();
        }
    });

    const editForm = document.getElementById('editReviewForm');
    if(editForm) {
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var formData = new FormData(this);
            formData.append('reviewId', document.getElementById('editReviewId').value);

            fetch('/updateReview', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    Swal.fire('Success', 'Review updated successfully', 'success').then(() => {
                        location.reload(); 
                    });
                } else {
                    Swal.fire('Error', 'Failed to update review', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Something went wrong', 'error');
            });
        });
    }
});





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




