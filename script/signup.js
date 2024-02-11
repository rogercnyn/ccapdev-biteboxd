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
    document.getElementById('toForm2').addEventListener('click', function() {
        event.preventDefault(); // Prevent default form submission behavior
    
        document.getElementById("yellow-box").classList.add('turn-white');
        document.getElementById('form1').classList.add('hide-form');
        document.getElementById('form2').classList.remove('hide-form');
    
        document.getElementById('ellipse-2').classList.add('ellipse-clicked');
        document.getElementById('form2container').classList.add('adjustForm2');
        document.getElementById('toForm3').classList.add('adjustButton2');
    
    });
    
    
    document.getElementById('toForm3').addEventListener('click', function() {
        event.preventDefault(); // Prevent default form submission behavior
    
        document.getElementById('form2').classList.add('hide-form');
        document.getElementById('form3').classList.remove('hide-form');
        document.getElementById('ellipse-3').classList.add('ellipse-clicked');
    
    });
    
}


