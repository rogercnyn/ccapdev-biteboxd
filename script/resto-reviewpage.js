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
        alert('Maximum of 4 media files allowed.');
        event.target.value = '';
        return;
    } else {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function (e) {
                const mediaContainer = document.createElement('div');
                mediaContainer.className = 'photo-container-item';

                if (isImage(file)) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Media Preview';
                    img.className = 'photo-preview';
                    img.style.borderRadius = '10px';

                    img.addEventListener('click', function () {
                        openModal(e.target.result);
                    });

                    mediaContainer.appendChild(img);
                } else if (isVideo(file)) {
                    const video = document.createElement('video');
                    video.src = e.target.result;
                    video.controls = true;
                    video.className = 'photo-preview';
                    video.style.borderRadius = '10px';

                    video.addEventListener('click', function () {
                        openModal(e.target.result);
                    });

                    mediaContainer.appendChild(video);
                }

                const removeButton = document.createElement('div');
                removeButton.innerHTML = '&#10006;';
                removeButton.className = 'remove-button';

                removeButton.addEventListener('click', function () {
                    mediaContainer.remove();

                    document.getElementById('photo-input').disabled = false;
                    document.querySelector('.publish-button').disabled = false;
                });

                mediaContainer.appendChild(removeButton);

                photoContainer.appendChild(mediaContainer);
            };

            reader.readAsDataURL(file);
        }

        const fileInput = document.getElementById('photo-input');
        fileInput.disabled = currentPhotos >= maxPhotos;

        const uploadButton = document.querySelector('.publish-button');
        uploadButton.disabled = currentPhotos >= maxPhotos;
    }
}

function isImage(file) {
    return file.type.startsWith('image');
}

function isVideo(file) {
    return file.type.startsWith('video');
}

function isImage(file) {
    return file.type.startsWith('image');
}

function isVideo(file) {
    return file.type.startsWith('video');
}


function openModal(mediaSrc) {
    const modal = document.getElementById('modal');
    const modalMediaContainer = document.getElementById('modal-media-container');

    modalMediaContainer.innerHTML = '';

    const isVideoMedia = /\.(mp4|webm|ogg)$/i.test(mediaSrc);

    if (isVideoMedia) {
        const video = document.createElement('video');
        video.id = 'modal';
        video.src = mediaSrc;
        video.controls = true;
        video.style.width = '100%'; 
        video.style.height = 'auto'; 
        modalMediaContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = mediaSrc;
        img.style.width = '100%';
        img.style.height = 'auto';
        modalMediaContainer.appendChild(img);
    }

    modal.style.display = 'flex';

    document.body.classList.add('modal-open');
    
}


function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
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

    if (isLogged) {
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

function toggleText(reviewId, seeMoreLinkId, reviewPanelId) {
    var review = document.getElementById(reviewId);
    var seeMoreLink = document.getElementById(seeMoreLinkId);
    var reviewPanel = document.getElementById(reviewPanelId);

    // Store the original content if not already stored
    if (!review.originalContent) {
        review.originalContent = review.innerHTML;
    }

    if (review.style.maxHeight) {
        // If it's expanded, collapse it
        review.innerHTML = review.originalContent;
        review.style.maxHeight = null;
        seeMoreLink.innerHTML = '<b>...see more</b>';
        reviewPanel.style.maxHeight = null;
    } else {
        // If it's collapsed, expand it
        review.innerHTML = review.originalContent + " music. It's very vibey and all. Many Lasallians would love this place. I swear! Try it guys! It's very vibey and all. Many Lasallians would love this place. I swear! Try it guys! It's very vibey and all. Many Lasallians would love this place. I swear! Try it guys! It's very vibey and all. Many Lasallians would love this place. I swear! Try it guys!";
        review.style.maxHeight = review.scrollHeight + "px";
        seeMoreLink.innerHTML = '<b>...see less</b>';
        reviewPanel.style.maxHeight = reviewPanel.scrollHeight + "px";
    }
}


