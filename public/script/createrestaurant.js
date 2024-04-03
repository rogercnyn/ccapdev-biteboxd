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
    const password = $('#password').val();
    const confirmPassword = $('#confirmpass').val();
    
    if (password !== confirmPassword || password === '' || confirmPassword === '') {
        return false;
    } else {
        $('#confirmpass').parsley().removeError('custom');
        return true;
    }
}

$(document).ready(function() {

    document.getElementById('uploadButton').addEventListener('click', function(event) {
        event.preventDefault();
        
        $('#createRestoForm').parsley().isValid()

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

    document.getElementById('publishButton').addEventListener('click', function(event) {
        event.preventDefault();

            if (!checkPasswordsMatch()) {
                document.getElementById('username').value= "";
                document.getElementById('password').value= "";
                document.getElementById('confirmpass').value= "";
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
                                
                                    
                                    document.getElementById('createRestoForm').submit();
                                    document.getElementById('createRestoForm').reset();
                                });
                                
                            }
                        });
                    }
                });
            }
    });
});

