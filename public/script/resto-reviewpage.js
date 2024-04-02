
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



    // $(".reviewbody").hide();

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

        // console.log(likes)
        
        initializeQuill(reviewFoodSlider, reviewServiceSlider, reviewPriceSlider);
        document.getElementById('photo-input').addEventListener('change', (event) => handleFileSelect(event, 'photo-container', 'photo-input', '.publish-button'));
    }
    
});

