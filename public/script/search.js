

function clickTrafficLight(element) {
    
    let siblings = element.parentElement.children
    Array.from(siblings).forEach(sibling => sibling.style.border = "none")
    element.style.border = "2px solid black";
}


function goToReviewPage(link){
    window.location.href = `/resto-reviewpage/${link}`
}

$(document).ready(function() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const query = params.get('query')
    const filterFoodSlider = new Slider(document.getElementsByClassName('filter-food-rating'));
    const filterServiceSlider = new Slider(document.getElementsByClassName('filter-service-rating'));
    const filterStarSlider = new Slider(document.getElementsByClassName('slider-star-rating'));
  
    filterFoodSlider.initializeHover();
    filterServiceSlider.initializeHover();
    filterStarSlider.initializeHover();

    $("#applyFilter").click(function(){  

        let minStar = filterStarSlider.getValue();
        let locationInput = $("#city-filter").val();
        let minRev = $("#min-review-filter").val();
        let minPrice = $("#min-price-filter").val();
        let maxPrice = $("#max-price-filter").val();

        let url = `${window.location.href.split('?')[0]}?query=${query}&minStar=${minStar}&locationInput=${locationInput}&minRev=${minRev}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
        
        window.location.href = url

    });

    $('#criteria').change(function() {
        var sorting = $(this).val();
        let url = `${window.location.href.split('?')[0]}?query=${query}&sorting=${sorting}`;
        window.location.href = url

    });
})