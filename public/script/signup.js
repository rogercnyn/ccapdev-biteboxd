function toggleTag(tag) {
    tag.classList.toggle('selected');
}

function triggerFileInput(element) {
    
    clickAvatar(element);
    var input = document.getElementById('avatar-upload');
    input.click();
}

function clickAvatar(element) {

    
    var inputs = document.querySelectorAll('.pic-option'); 
    inputs.forEach(function(input) {
        input.classList.remove('clicked');
    });
    

    var input = element.querySelector('pic-option');
    element.classList.add('clicked');
}

function initializeSignUp(){
    
    
    document.getElementById('toForm3').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
    
        // Validate the form using Parsley.js
        $('#form2').parsley().validate();
    
        if ($('#form2').parsley().isValid()) {
            // Form is valid, proceed to the next step
            document.getElementById('form2').classList.add('hide-form');
            document.getElementById('form3').classList.remove('hide-form');
            document.getElementById('ellipse-3').classList.add('ellipse-clicked');
        } else {
        }
    });
    
    
}


function getTasteProfile() {
    const selectedTags = $('.tag.selected').toArray().map(tag => tag.textContent);
    return selectedTags;
}

function getAvatar() {
    const selectedAvatar = $('.avatar-container .pic-option.clicked img').attr('src');
    if (selectedAvatar) {
        return selectedAvatar.split('/').pop();
    } else {
         const uploadedAvatar = $('#avatar-upload')[0].files[0];
        if (uploadedAvatar) {
            // Since we can't return the file itself in JSON, signal that a file has been uploaded
            // The actual file upload handling will need to be adjusted to check for this signal and handle the file accordingly
            return 'FILE_UPLOADED';
            } else {
                return null;
            }
    }
}



function handleFileSelect(event, photoContainerSelector) {
    const files = event.target.files;
    const photoContainer = document.getElementById(photoContainerSelector);
    const picture = files[0];
    const reader = new FileReader();

    $(".upload-icon").css("display", "none");


    reader.onload = function (e) {
        $('.photo-container-item').remove();

        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'photo-container-item';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Media Preview';

        img.width = $(".pic-option").width()
        img.height = $(".pic-option").height() + 7;
        img.classList.add('image-src')


        mediaContainer.appendChild(img);
        photoContainer.appendChild(mediaContainer);
    };
    reader.readAsDataURL(picture);   

}


$(document).ready(function() {
    
    initializeSignUp(); 

    $('#form1').parsley();

    $('#form1').on('submit', function(e) {
        if ($('#form1').parsley().isValid()) {
            document.getElementById("yellow-box").classList.add('turn-white');
            document.getElementById('form1').classList.add('hide-form');
            document.getElementById('form2').classList.remove('hide-form');
        
            document.getElementById('ellipse-2').classList.add('ellipse-clicked');
            document.getElementById('form2container').classList.add('adjustForm2');
            document.getElementById('toForm3').classList.add('adjustButton2');
        } 
        e.preventDefault(); 
    });

    $('#form3').on('submit', function(e) {
        e.preventDefault();
        
        let index = -1;
        // Create FormData object to handle file uploads
        let formData = new FormData();
        let tasteProfile = getTasteProfile();
        formData.append('firstName', $('#first-name').val());
        formData.append('lastName', $('#last-name').val());
        formData.append('username', $('#username').val());
        formData.append('email', $('#email').val());
        formData.append('password', $('#password').val());

        // for(let i = 0; i < tasteProfile.length; i++) {
        //     formData.append('tasteProfile', tasteProfile[i]);
        // }

        formData.append('tasteProfile', JSON.stringify(getTasteProfile()));

        var clickedPicOption = document.getElementsByClassName('pic-option clicked')[0]
        var options = document.getElementsByClassName('pic-option');



        for (let i = 0; i < options.length; i++) {
            if (clickedPicOption == options[i]) {
                index = i;
                break;
            }
        }

        if(index == 3) {
            formData.append('profilePic', $('#avatar-upload')[0].files[0]); 
        } else if (index != -1) {
            let src = options[index].querySelector('img').src.split('/').pop();
            formData.append('avatar', src);
        }
     

        fetch('/signup', {
            method: 'POST',
            body: formData // Send formData object
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log(data);
            Swal.fire({
                title: 'Success!',
                text: 'User created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/';
            });
        })
        .catch(error => {
            console.error('Error creating user:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while creating user',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });

    // document.getElementById()
    
    $('#avatar-upload').on('change', function(event) {
        // console.log("TRYING TO SETUP HERE")
        handleFileSelect(event, 'avatar-upload-parking', 'photo-input');
    });

    

});


