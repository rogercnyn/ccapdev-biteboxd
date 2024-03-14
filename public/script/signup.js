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

