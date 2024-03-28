
let maxPhotos = 4;
let reviewQuill;
let editQuill;
let photoContainer;
let reviewFoodSlider;
let reviewPriceSlider;
let reviewServiceSlider;
let filterStarSlider;
let filterPriceSlider
let filterFoodSlider
let filterServiceSlider
let editFoodSlider
let editServiceSlider
let editPriceSlider;

function searchReview(){
    let reviews = document.getElementsByClassName("review")

    Array.from(reviews).slice(0, reviews.length - 1).forEach(review => $(review).hide())
}


function handleFileSelect(event, photoContainerSelector, photoInput, publishButton) {
    const files = event.target.files;
    console.log(photoContainerSelector)
    const photoContainer = document.getElementById(photoContainerSelector);
    const currentPhotos = photoContainer.querySelectorAll('.photo-preview').length;

    if (currentPhotos + files.length > maxPhotos) {
        fireSwal('error', 'Error!', 'You can only upload up to 4 photos or videos.', false, 1500);
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

                    document.getElementById(photoInput).disabled = false;
                    document.querySelector(publishButton).disabled = false;
                });

                mediaContainer.appendChild(removeButton);

                photoContainer.appendChild(mediaContainer);
            };

            reader.readAsDataURL(file);
        }

        const fileInput = document.getElementById(photoInput);
        fileInput.disabled = currentPhotos >= maxPhotos;

        const uploadButton = document.querySelector(publishButton);
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


function handleUpload (photoContainer, photoInput, titleInput, quill, foodSlider, serviceSlider, affordabilitySlider, postLink, existingMedia=[]) {
    let title = titleInput.val().trim();
    let reviewHtml = quill.getHtml();
    

    let foodRating = foodSlider.getValue();
    let serviceRating = serviceSlider.getValue();
    let affordabilityRating = affordabilitySlider.getValue();
    const files = document.getElementById(photoInput).files;

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
        
        quill.clear();
        photoContainer.innerHTML = '';
        $(titleInput).val('');
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    
    formData.append('title', title);
    formData.append('reviewHtml', reviewHtml);
    formData.append('foodRating', foodRating);
    formData.append('serviceRating', serviceRating);
    formData.append('affordabilityRating', affordabilityRating);
    
    for (let i = 0; i < existingMedia.length; i++) {
        formData.append('existingMedia[]', existingMedia[i]);
    }

    
   $.ajax({
        url: postLink,
        type: 'POST',
        data: formData,
        processData: false,  
        contentType: false,
        success: function(response) {
            window.location.reload();
        },
        error: function(error) {
            console.error('Error uploading review:', error);
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

function editReview(foodRating, serviceRating, priceRating, order) {
    editFoodSlider = new Slider(document.getElementsByClassName('edit-food-rating'));
    editServiceSlider = new Slider(document.getElementsByClassName('edit-service-rating'));
    editPriceSlider = new Slider(document.getElementsByClassName('edit-price-rating'));

    let titleArea = $(`#reviewEditTitle${order}`);
    titleArea.text(titleArea.attr('value'));

    editFoodSlider.handleClick(foodRating)
    editServiceSlider.handleClick(serviceRating)
    editPriceSlider.handleClick(priceRating)

    
    editFoodSlider.initializeHover();
    editServiceSlider.initializeHover();
    editPriceSlider.initializeHover();

    document.getElementById(`editReview${order}`).style.display = 'block';
    document.getElementById(`editReviewOverlay${order}`).style.display = 'block';
    
    var existingReviewContent = document.getElementById(`getReview${order}`).innerHTML;

    editQuill = new QuillEditor(`#reviewEditor${order}`, 120, 'Write your review here...')

    editQuill.setInnerHTMl(existingReviewContent)
    document.getElementById(`editphoto-input${order}`).addEventListener('change', (event) => handleFileSelect(event, `editphoto-container${order}`, `editphoto-input${order}`, `#publisheditbtn`));

}


function closeEditPopup(order){
    let editorContainer = document.getElementById(`reviewEditor${order}`)
    

    editorContainer.parentNode.querySelector('.ql-toolbar').remove()
    $(editorContainer).empty()

    document.getElementById(`editReview${order}`).style.display = 'none';
    document.getElementById(`editReviewOverlay${order}`).style.display = 'none';
}

function publishEditedReview(order, id){

    // fireSwal('success', 'Success!', 'Edited review is now published.', false, 2500);

    let existingMedia = new Array();
    let editPhotoContainer = $(`#editphoto-container${order}`)
    let editPhotoInput = `editphoto-input${order}`
    let editTitle = $(`#reviewEditTitle${order}`)


    $(`#editphoto-container${order} .revpic`).each(function() {
        let src = ($(this).attr('src')).split('/');
        existingMedia.push(src[src.length - 1]);
    });


    let editLink = appendLink(`/${id}/edit`)
    console.log("outside: ", typeof existingMedia)
    handleUpload(editPhotoContainer, editPhotoInput, editTitle, editQuill, editFoodSlider, editServiceSlider, editPriceSlider, editLink, existingMedia)


    // closeEditPopup();
}



function deleteReview(id) {
    Swal.fire({
        title: 'Delete Review',
        text: 'Are you sure you want to delete this review?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true,
        customClass: {
            container: 'swal-custom-font',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Delete the review
            Swal.fire({
                title: 'Review Deleted',
                text: 'The review has been successfully deleted.',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true
            });
            let deleteLink = appendLink(`/${id}/delete`)    
            $.ajax({
                url: deleteLink,
                type: 'POST',
                success: function(response) {
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error deleting review:', error);
                }
            });
        }
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
    let createLink  = appendLink('/create')

    document.querySelector('.publish-button').addEventListener('click', (event) => 
    
    handleUpload($('#photo-container'), 'photo-input', $('#review-title'), reviewQuill, reviewFoodSlider, reviewServiceSlider, reviewPriceSlider, createLink));
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



    $(".reviewbody").hide();

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
        document.getElementById('photo-input').addEventListener('change', (event) => handleFileSelect(event, 'photo-container', 'photo-input', '.publish-button'));
    }
    
});

