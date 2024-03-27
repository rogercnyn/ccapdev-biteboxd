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
    }

    else {
        return;
    }
}

document.getElementById('publishButton').addEventListener('click', function(event) {
    event.preventDefault();
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
});

