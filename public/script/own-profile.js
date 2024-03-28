document.addEventListener('DOMContentLoaded', function () {

    
    const tabs = document.querySelectorAll('.tab-btn');
    const all_content = document.querySelectorAll('.content');
    const line = document.querySelector('.line');

    document.getElementById('bio').innerText = document.getElementById('bio').getAttribute('value');

    function activateTab(tabIndex) {
        tabs.forEach(tab => { tab.classList.remove('active'); });
        all_content.forEach(content => { content.classList.remove('active'); });

        tabs[tabIndex].classList.add('active');
        all_content[tabIndex].classList.add('active');

        //line size indicator (OC haha)
        line.style.width = tabs[tabIndex].offsetWidth + "px";
        line.style.left = tabs[tabIndex].offsetLeft + "px";
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(index));
    });

    const defaultTabIndex = 0; 
    activateTab(defaultTabIndex);
});


function deleteProfile(username){
    Swal.fire({
        title: 'Delete Profile',
        text: 'Are you sure you want to delete your account?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        customClass: {
            container: 'swal-custom-font',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Confirm Deletion',
                text: 'To confirm deletion, type \'Confirm\':',
                input: 'text',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Submit',
                inputValidator: (value) => {
                    if (value !== "Confirm") {
                        return 'You need to enter the correct confirmation text!';
                    }
                },
                customClass: {
                    container: 'swal-custom-font',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Deleting profile:', username);
                    fetch(`/deleteProfile/${username}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username })
                    })
                    .then(response => {
                        console.log('Server response:', response); 
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .then(data => {
                        console.log('Deletion successful:', data); 
                        Swal.fire({
                            title: 'Success!',
                            text: 'Your account has been successfully deleted.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true
                        }).then(() => {
                            window.location.href = '/logout';
                        });
                    })
                    .catch(error => {
                        console.error('Error deleting profile:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'An error occurred while deleting your account.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
                }
            });
        }
    });
}


$(document).ready(function() {
    const likesets = document.getElementsByClassName('likeset');
    const likes = [];
    
    Array.from(likesets).forEach(likeset => {
        let likeButton = likeset.querySelector('#like');
        let dislikeButton = likeset.querySelector('#dislike');
        let counters = likeset.querySelectorAll(".numberoffeedback")
        let reviewId = likeset.getAttribute('id')
        likes.push(new Like(likeButton, dislikeButton, counters[0], counters[1], reviewId));
    });
    
    Array.from(likes).forEach(like => {
        like.initializeClick();
    });

    
    $(".reviewbody").hide();

    $(".titlearea").click(function() {
        var review = $(this).closest('.review');

        var url = "/resto-reviewpage/" + $(review).data('restaurant') + "#" + $(review).attr('id');
        window.location.href = url;
    });
    
});