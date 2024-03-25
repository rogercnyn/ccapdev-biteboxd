
let maxPhotos = 4;
let reviewQuill;
let photoContainer;
let reviewFoodSlider;
let reviewPriceSlider;
let reviewServiceSlider;
let filterStarSlider;
let filterPriceSlider
let filterFoodSlider
let filterServiceSlider

function searchReview(){
    let reviews = document.getElementsByClassName("review")

    Array.from(reviews).slice(0, reviews.length - 1).forEach(review => $(review).hide())
}


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
                removeButton.innerHTML = '&times;';
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

function fireSwal(icon, title, text, showConfirmButton, timer) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: showConfirmButton,
        timer: timer
    });

}


function handleUpload() {
    const photoContainer = document.getElementById('photo-container');
    let titleInput = $('#review-title');
    let title = titleInput.val().trim();
    let reviewHtml = reviewQuill.getHtml();
    

    let foodRating = reviewFoodSlider.getValue();
    let serviceRating = reviewServiceSlider.getValue();
    let affordabilityRating = reviewPriceSlider.getValue();


    if (foodRating === 0 || serviceRating === 0 || affordabilityRating === 0) {
        fireSwal('error', 'Error!', 'Cannot publish review with zero ratings. The lowest possible score is one.', false, 2500);
        return;
    }


    if (!title) {
        fireSwal('error', 'Error!', 'Please enter a title for your review.', false, 2500);
      
        return;
    }

    else if (!reviewHtml) {
        fireSwal('error', 'Error!', 'Please enter a review.', false, 2500);
    }

    else {
        fireSwal('success', 'Success!', 'Your review is now published.', false, 2500);
        
        reviewQuill.clear();
        photoContainer.innerHTML = '';
        $(titleInput).val('');


    }


    let currentLink = new URL(window.location.href);
    let createLink = currentLink.pathname + '/create';

    $.ajax({
        url: createLink,
        type: 'POST',
        data: {
            title: title, 
            reviewHtml: reviewHtml,
            foodRating: foodRating,
            serviceRating: serviceRating,
            affordabilityRating: affordabilityRating
        },
        success: function(response) {
            window.location.reload();
        },
        error: function(error) {
            // Handle any errors
        }
    });

    
    reviewFoodSlider.reset();
    reviewPriceSlider.reset();
    reviewServiceSlider.reset();

}


function toggleOptions(element) {
    $(element).next('.options-popup').toggle()
}

function removeMedia(element) {
    var mediaContainer = element.parentNode;
    mediaContainer.parentNode.removeChild(mediaContainer);
}

var quill; 

function editReview() {
    document.getElementById('editReview').style.display = 'block';
    document.getElementById('editReviewOverlay').style.display = 'block';
    
    var existingReviewContent = document.getElementById('getReview').innerHTML;

    if (!quill) {
        quill = new Quill('#reviewEditor', {
            theme: 'snow',
            modules: {
                toolbar: false 
            }
        });
    }
    quill.root.innerHTML = existingReviewContent;
    var quillEditor = document.querySelector('#reviewEditor');
    quillEditor.style.borderRadius = '10px';
}


function closeEditPopup(){
    document.getElementById('editReview').style.display = 'none';
    document.getElementById('editReviewOverlay').style.display = 'none';
}

function publishEditedReview(){
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Edited review is now published.',
        showConfirmButton: false,
        timer: 2500 
    });
    closeEditPopup();
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


function initializeMap() {
    let x = $("#xcoord").val()
    let y = $("#ycoord").val()
    let title = $(".resto-title").text()
    
    let map = L.map('map').setView([ x, y ], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([ x, y]).addTo(map)
      .bindPopup(title)
      .openPopup();
}

function initializeQuill() {
    reviewQuill = new QuillEditor('#review-editor', 120, 'Write your review here...');
    document.querySelector('.publish-button').addEventListener('click', handleUpload);
}

function initSliders() {
    filterStarSlider = new Slider(document.getElementsByClassName('slider-star-rating'));
    filterPriceSlider = new Slider(document.getElementsByClassName('filter-price-rating'));
    filterFoodSlider = new Slider(document.getElementsByClassName('filter-food-rating'));
    filterServiceSlider = new Slider(document.getElementsByClassName('filter-service-rating'));

    reviewFoodSlider = new Slider(document.getElementsByClassName('review-food-rating'));
    reviewServiceSlider = new Slider(document.getElementsByClassName('review-service-rating'));
    reviewPriceSlider = new Slider(document.getElementsByClassName('review-price-rating'));

    const sliders = [filterStarSlider, filterPriceSlider, filterFoodSlider, filterServiceSlider, reviewFoodSlider, reviewServiceSlider, reviewPriceSlider];
    
    sliders.forEach(slider => { slider.initializeHover(); });

}

function initRevFilterSort(){
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const minStar = params.get('minStar')
    const minPrice = params.get('minPrice')
    const minFood = params.get('minFood')
    const minService = params.get('minService')
    const searchTextValue = params.get('searchText')
    const sortingVal = params.get('sorting')

    if(minStar) {
        filterStarSlider.handleClick(minStar)
    } 

    if(minPrice) {
        filterPriceSlider.handleClick(minPrice)  
    }

    if(minFood) {
        filterFoodSlider.handleClick(minFood)
    }

    if(minService) {
        filterServiceSlider.handleClick(minService)
    }

    $('#search-rev-input').val(searchTextValue)

    if(sortingVal) {
        $('#criteria').val(sortingVal)

    }
    

    $("#applyFilter").click(function() {

        let minStar = filterStarSlider.getValue()
        let minPrice = filterPriceSlider.getValue()
        let minFood = filterFoodSlider.getValue()
        let minService = filterServiceSlider.getValue()
        let searchText = $('#search-rev-input').val();
        var sorting = $('#criteria').val();

        let url = `${window.location.href.split('?')[0]}?minStar=${minStar}&minPrice=${minPrice}&minFood=${minFood}&minService=${minService}&searchText=${searchText}&sorting=${sorting}`;

        window.location.href = url;

    })

    $(".search-rev-but").click(function() {
       searchText()    
    })

    $("#noFilter").click(function () {
        window.location.href = window.location.href.split('?')[0];

    })

    $("#clearFilter").click(function () {

        filterStarSlider.reset();
        filterPriceSlider.reset();
        filterFoodSlider.reset();
        filterServiceSlider.reset();
        $('#search-rev-input').val('');
        $('#criteria').val('recommended');
    })

    
    $('#search-rev-input').keypress(function(e) {
        if (e.key === 'Enter') {
            searchText()            
        }
    });

    
    function searchText() {
        let searchText = $('#search-rev-input').val();
        let url = `${window.location.href.split('?')[0]}?searchText=${searchText}`;
        window.location.href = url;
    }
}

$(document).ready(function() {

    initSliders()
    initializeMap()
    initRevFilterSort()


    let isLogged = document.querySelector('.publish-button')

    if(isLogged) {
        
        const likesets = document.getElementsByClassName('likeset');
        const likes = [];
        
        Array.from(likesets).forEach(likeset => {
            let likeButton = likeset.querySelector('#like');
            let dislikeButton = likeset.querySelector('#dislike');
            let counters = likeset.querySelectorAll(".numberoffeedback")
            let reviewId = likeset.getAttribute('id')
            likes.push(new Like(likeButton, dislikeButton, counters[0], counters[1], reviewId));
        });
        
        Array.from(likes).forEach(like => {
            like.initializeClick();
        });

        console.log(likes)
        
        initializeQuill(reviewFoodSlider, reviewServiceSlider, reviewPriceSlider);
        document.getElementById('photo-input').addEventListener('change', handleFileSelect);
    }
    
});

