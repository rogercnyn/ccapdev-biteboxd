

function clickTrafficLight(element) {
    
    let siblings = element.parentElement.children
    Array.from(siblings).forEach(sibling => sibling.style.border = "none")
    element.style.border = "2px solid black";
}


$(document).ready(function() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const minRev = params.get('minRev')
    const minStar = params.get('minStar')
    const locationInput = params.get('locationInput')
    const minPrice = params.get('minPrice')
    const maxPrice = params.get('maxPrice')
    const sorting = params.get('sorting')



    const query = params.get('query')
    const filterFoodSlider = new Slider(document.getElementsByClassName('filter-food-rating'));
    const filterServiceSlider = new Slider(document.getElementsByClassName('filter-service-rating'));
    const filterStarSlider = new Slider(document.getElementsByClassName('slider-star-rating'));
  
    filterFoodSlider.initializeHover();
    filterServiceSlider.initializeHover();
    filterStarSlider.initializeHover();

    if(minStar) {
        filterStarSlider.handleClick(minStar);
    }

    if (minRev) {   
        $('#min-review-filter').val(minRev);
    }

    if (locationInput) {
        $('#city-filter').val(locationInput);
    }

    if (minPrice) {
        $('#min-price-filter').val(minPrice);
    }

    if (maxPrice) {
        $('#max-price-filter').val(maxPrice);
    }

    if (sorting) {  
        $("#criteria").val(sorting);
    }

    $(".search-bar").val(query);

    function applyFilter(){
        let minStar = filterStarSlider.getValue();
        let locationInput = $("#city-filter").val();
        let minRev = $("#min-review-filter").val();
        let minPrice = $("#min-price-filter").val();
        let maxPrice = $("#max-price-filter").val();
        var sorting = $("#criteria").val();

        let url = `${window.location.href.split('?')[0]}?query=${query}&minStar=${minStar}&locationInput=${locationInput}&minRev=${minRev}&minPrice=${minPrice}&maxPrice=${maxPrice}&sorting=${sorting}`;
        
        window.location.href = url
    }

    $("#applyFilter").click(function(){  

        applyFilter();
        $('#city-filter').val('');
        $('#min-price-filter').val('');
        $('#max-price-filter').val('');
        $('#criteria').val('recommended');

    });

    $("#clearFilter").click(function() {
        filterStarSlider.reset();
        $('#min-review-filter').val('');
        $('#city-filter').val('');
        $('#min-price-filter').val('');
        $('#max-price-filter').val('');
        $('#criteria').val('recommended');
    })
    

    $('#criteria').change(function() {
        applyFilter();
    });
})