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


function searchReview(){
    let reviews = document.getElementsByClassName("review")

    Array.from(reviews).slice(0, reviews.length - 1).forEach(review => $(review).hide())
}



document.querySelector('.publish-button').addEventListener('click', handleUpload);
document.getElementById('photo-input').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const files = event.target.files;
    const photoContainer = document.getElementById('photo-container');
    const currentPhotos = photoContainer.querySelectorAll('.photo-preview').length;

    if (currentPhotos + files.length > maxPhotos) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'You can only upload up to 4 photos or videos.',
            showConfirmButton: false,
            timer: 1500 
        });
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
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Cannot publish review with zero ratings. The lowest possible score is one.',
            showConfirmButton: false,
            timer: 2500 
        });
        return;
    }

    if (textarea.value.trim() === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Please enter a title for your review.',
            showConfirmButton: false,
            timer: 2500 
        });
        return;
    }

    else {

        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your review is now published.',
            showConfirmButton: false,
            timer: 2500 
        });
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
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Edited review is now published.',
        showConfirmButton: false,
        timer: 2500 
    });
}

function deleteReview() {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your review is now deleted.',
        showConfirmButton: false,
        timer: 2500 
    });
}

function toggleSeeMore(reviewId) {
    var truncateText = document.getElementById(reviewId);
    var fullText = truncateText.querySelector('.full-text');
    var seeMoreButton = truncateText.querySelector('.see-more');

    var computedDisplayStyle = window.getComputedStyle(fullText).display;

    if (computedDisplayStyle === 'none') {
        truncateText.style.maxHeight = 'none'; 
        fullText.style.display = 'inline'; 
        seeMoreButton.innerHTML = '<b>...see less</b>';
    } else {
        truncateText.style.maxHeight = '60px'; 
        fullText.style.display = 'none'; 
        seeMoreButton.innerHTML = '<b>...see more</b>';
    }
}


