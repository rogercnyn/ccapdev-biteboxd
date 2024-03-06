$(document).ready(function() {

    let originalResultArray = $('.result-box').toArray(); // Store the original list of restaurants

    function sortResults(criteria) {
        let resultArray = originalResultArray.slice(); // Make a copy of the original list

        if (criteria === 'default') {
            // Sort result boxes based on restaurant name in ascending order
            resultArray.sort(function(a, b) {
                const nameA = a.dataset.name.toUpperCase();
                const nameB = b.dataset.name.toUpperCase();
                return nameA.localeCompare(nameB);
            });
        } else if (criteria === 'recommended') {
            resultArray = resultArray.filter(function(resultBox) {
                return parseFloat(resultBox.dataset.rating) >= 4;
            });
            resultArray.sort(function(a, b) {
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            });
        } else if (criteria === 'reviews') {
            resultArray.sort(function(a, b) {
                return parseInt(b.dataset.numberOfReviews) - parseInt(a.dataset.numberOfReviews);
            });
        } else if (criteria === 'rating') {
            resultArray.sort(function(a, b) {
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            });
        } else if (criteria === 'price') {
            resultArray.sort(function(a, b) {
                return parseInt(b.dataset.startPriceRange, 10) - parseInt(a.dataset.startPriceRange, 10);
            });
        }

        $('.all-results').empty().append(resultArray);
        $('#result-length').text(resultLength);
    }


    // Event listener for dropdown change
    $('#criteria').change(function() {
        let selectedCriteria = $(this).val();
        let currentResultLength = parseInt($('#result-length').text()); // Get the current result length
        sortResults(selectedCriteria, currentResultLength);
    });
    

});
