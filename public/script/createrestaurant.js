// document.addEventListener("DOMContentLoaded", function () {
//     const publishButton = document.querySelector(".publishbutton");
//     publishButton.addEventListener("click", publishRestaurant);
// });

function openFileInput() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function () {
        updatePicture(input);
    };

    input.click();
}

function updatePicture(input) {
    var output = document.getElementById('restopicture');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            output.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);

        // Assign the selected file to the input file element
        var imageInput = document.getElementById('imageInput');
        imageInput.files = input.files;
    } else {
        return;
    }
}

function closeCredentialsPopup() {
    document.getElementById('credentialsModal').style.display = 'none';
    document.getElementById('credentialsOverlay').style.display = 'none';
}

function validateForm() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="time"], textarea, input[type="number"]');

    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].classList.contains('modal-field')) {
            if (inputs[i].value.trim() === '' || !inputs[i].checkValidity()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please make sure all fields are filled out correctly!',
                    customClass: {
                        container: 'swal-custom-font',
                    }
                });
                return false; 
            }
        }
    }
    return true; 
}

function checkPasswordsMatch() {
    const password = $('#password').val();
    const confirmPassword = $('#confirmpass').val();
    
    if (password !== confirmPassword || password === '' || confirmPassword === '') {
        return false;
    } else {
        $('#confirmpass').parsley().removeError('custom');
        return true;
    }
}


document.getElementById('uploadButton').addEventListener('click', function(event) {
    event.preventDefault();
    $('#createRestoForm').parsley();

    if (!validateForm()) {
        return; 
    }

    else {
        
        document.getElementById('credentialsModal').style.display = 'block';
        document.getElementById('credentialsOverlay').style.display = 'block';

        $('#credentialsModal').parsley().validate();
        if (!checkPasswordsMatch()) {
            return;
        }
    
        else {
            Swal.fire({
                title: 'Publish Restaurant',
                text: 'Are the details entered correct?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                customClass: {
                    container: 'swal-custom-font',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Confirm Upload',
                        text: 'To confirm, type \'Confirm\':',
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
                            Swal.fire({
                                title: 'Success!',
                                text: 'The restaurant has been successfully uploaded. Confirmation Successful.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                timer: 3000,
                                timerProgressBar: true
                            }).then(() => {
                                document.getElementById('createRestoForm').reset();
                                
                                document.getElementById('createRestoForm').submit();
                            });
                            
                        }
                    });
                }
            });
        }
    }
});

