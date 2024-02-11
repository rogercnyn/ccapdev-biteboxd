let starsContainers = document.querySelectorAll(".star-sorting");
let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};
let maxPhotos = 4;

document.addEventListener("DOMContentLoaded", function () {
    var quill = new Quill('#editor', {
        theme: 'snow',
        height: 120,
        placeholder: 'Type here your review!'
    });
});

function addRating(criterion, n) {
    currentRatings[criterion] = n;
    updateStars();
}

function updateStars() {
    starsContainers.forEach(container => {
        const criterion = container.dataset.criterion;
        const stars = container.children;

        Array.from(stars).forEach((star, index) => {
            star.classList.toggle("colored", index < currentRatings[criterion]);
        });
    });
}

starsContainers.forEach(container => {
    container.addEventListener("mouseenter", function (event) {
        const criterion = container.dataset.criterion;
        const index = Array.from(container.children).indexOf(event.target);

        currentRatings[criterion] = index + 1;
        updateStars();
    });

    container.addEventListener("mouseleave", function () {
        updateStars();
    });

    container.addEventListener("click", function (event) {
        const criterion = container.dataset.criterion;
        const index = Array.from(container.children).indexOf(event.target);

        currentRatings[criterion] = index + 1;
        updateStars();
    });
});

document.getElementById('photo-input').addEventListener('change', handleFileSelect);
document.querySelector('.publish-button').addEventListener('click', handleUpload);

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

                // Append the container to the main photo container
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

function toggleColor(type) {
    var likeButton = document.querySelector('.like');
    var dislikeButton = document.querySelector('.dislike');

    if (type === 'like') {
      likeButton.classList.contains('colored');
      dislikeButton.classList.remove('colored');
    } else {
      dislikeButton.classList.contains('colored');
      likeButton.classList.remove('colored');
    }
}