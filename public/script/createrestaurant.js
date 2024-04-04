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
    let restoName = document.getElementById("restoName").value;
    let address = document.getElementById("address").value;
    let tags = document.getElementById("tags").value;
    let pricestart = document.getElementById("pricestart").value;
    let priceend = document.getElementById("priceend").value;
    let xcoord = document.getElementById("xcoord").value;
    let ycoord = document.getElementById("ycoord").value;
    let shortdescription = document.getElementById("shortdesc").value;
    let description = document.getElementById("desc").value;

    let operatinghourstart = document.getElementById("operatinghourstart").value;
    let operatinghourend = document.getElementById("operatinghourend").value;

    if (restoName === "" || address === "" || tags === "" || pricestart === "" || priceend === "" ||
        xcoord === "" || ycoord === "" || shortdescription === "" || description === "" || operatinghourstart === "" || operatinghourend === "") {
        return false;
    }

    if (parseFloat(pricestart) >= parseFloat(priceend)) {
        return false;
    }

    if (parseFloat(pricestart) <= 0 || parseFloat(priceend) <= 0) {
        return false;
    }

    return true; 
}

function checkPasswordsMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpass').value;
    
    if (password !== confirmPassword || password === '' || confirmPassword === '') {
        return false;
    } else {
        document.getElementById('confirmpass').removeAttribute('data-parsley-custom');
        return true;
    }
}

function validateCredentials() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpass').value;
    const pattern = /^[a-zA-Z0-9]+$/;

    if (username === '' || password === '' || confirmPassword === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'dito',
            customClass: {
                container: 'swal-custom-font',
            }
        });
        return false;
    }

    if (!(pattern.test(username)))
    {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please make sure the username is alphanumeric!',
            customClass: {
                container: 'swal-custom-font',
            },
            onClose: () => {
                document.getElementById('username').value = '';
            }
        });
        return false;
    }

    if (password.length < 8 || confirmPassword <8) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password must have at least 8 characters',
            customClass: {
                container: 'swal-custom-font',
            },
            onClose: () => {
                document.getElementById('password').value = '';
                document.getElementById('confirmpass').value = '';
            }
        });
        return false;
    }

    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password do not match!',
            customClass: {
                container: 'swal-custom-font',
            },
            onClose: () => {
                document.getElementById('password').value = '';
                document.getElementById('confirmpass').value = '';
            }
        });
        return false;
    }
    
    return true;
}


$(document).ready(function() {

    document.getElementById('uploadButton').addEventListener('click', function(event) {
        event.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please make sure all fields are filled out correctly!',
                customClass: {
                    container: 'swal-custom-font',
                }
            });
            return; 
        }

        else {     
            document.getElementById('credentialsModal').style.display = 'block';
            document.getElementById('credentialsOverlay').style.display = 'block';
        }
    });

    document.getElementById('publishButton').addEventListener('click', async function(event) {
        event.preventDefault();

            if(validateCredentials()){
                const username = document.getElementById('username').value;
                const response = await fetch('/checkUsername', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                const data = await response.json();

                if (data.exists) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Username already exists!",
                        onClose: () => {
                            document.getElementById('username').value = '';
                        }
                    });
                } else {
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
                                        document.getElementById('createRestoForm').submit();
                                        document.getElementById('createRestoForm').reset();
                                    });
                                    
                                }
                            });
                        }
                    });
                }
            }
            else {
                return;
            }
    });
});

