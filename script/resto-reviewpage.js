document.addEventListener("DOMContentLoaded", function () {
    quillEditor = new Quill('#editor', {
        theme: 'snow',
        height: 120,
        placeholder: 'Type here your review!'
    });
    document.querySelector('.publish-button').addEventListener('click', handleUpload);
});

let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};
let maxPhotos = 4;
let quillEditor;
let photoContainer;



function addRating(criterion, n) {
    currentRatings[criterion] = n;
    updateStars();
}



document.querySelector('.publish-button').addEventListener('click', handleUpload);

document.getElementById('photo-input').addEventListener('change', handleFileSelect);
function handleFileSelect(event) {
    const files = event.target.files;
    const photoContainer = document.getElementById('photo-container');
    const currentPhotos = photoContainer.querySelectorAll('.photo-preview').length;


    if (currentPhotos + files.length > maxPhotos) {
        alert('Maximum of 4 photos allowed.');
        event.target.value = ''; 
        return;
    }

    else {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
    
            reader.onload = function (e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'photo-container-item';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Photo Preview';
                img.className = 'photo-preview';
                img.style.borderRadius = '10px';

                const removeButton = document.createElement('div');
                removeButton.innerHTML = '&#10006;'; 
                removeButton.className = 'remove-button';
                removeButton.addEventListener('click', function () {
                    
                    imgContainer.remove();
                   
                    document.getElementById('photo-input').disabled = false;
                    document.querySelector('.publish-button').disabled = false;
                });

                
                imgContainer.appendChild(img);
                imgContainer.appendChild(removeButton);

                photoContainer.appendChild(imgContainer);
            };

            reader.readAsDataURL(file);
        }
        const fileInput = document.getElementById('photo-input');
        fileInput.disabled = currentPhotos >= maxPhotos;

        const uploadButton = document.querySelector('.publish-button');
        uploadButton.disabled = currentPhotos >= maxPhotos;
    }
}


function handleUpload() {
    const photoContainer = document.getElementById('photo-container');

    var textarea = document.getElementById("title");

    if (priceSlider.currentValue === 0 || foodQualitySlider.currentValue === 0 || serviceSlider.currentValue === 0) {
        alert('Cannot publish review with zero ratings.');
        return;
    }

    else {

        alert('Review Published!');
        quillEditor.root.innerHTML = '';
        photoContainer.innerHTML = '';
        textarea.value='';


        priceSlider.reset();
        foodQualitySlider.reset();
        serviceSlider.reset();

        updateStars();
    }

}


function detectLogin() {
    let publishrev = document.getElementById('publishreview')
    let logInArea = document.getElementById('cannot-publish')


    // console.log(publishrev)
    if(isLogged) {
        $(logInArea).hide();
        $(publishrev).show();
    } else {
        $(publishrev).hide();
        $(logInArea).show();
    }

}

function toggleOptions() {
    var popup = document.getElementById("optionsPopup");
    popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

function editReview() {
    alert("Edited review published!");
}

function deleteReview() {
    alert("Review deleted!");
}