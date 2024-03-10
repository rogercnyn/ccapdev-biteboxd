function sortResults() {
    const criteriaSelect = $('#criteria');
    const selectedCriteria = criteriaSelect.val(); // Store the selected option

    $.ajax({
        url: "/api/search/sort",
        method: 'GET',
        data: { criteria: selectedCriteria },
        success: function(response) {
            $('#results').html(response);
            // After updating the results, set the selected option based on the previous selection
            $('#criteria').val(selectedCriteria); // Reset the selected value to what was chosen
        },
        error: function(xhr, status, error) {
            console.error('Error sorting results:', error);
        }
    });
}



$(document).ready(function() {
    $('#criteria').on('change', sortResults); // Simplified event handler registration
});
