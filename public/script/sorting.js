$(document).ready(function() {
    $('#criteria').on('change', function() {
        const criteria = $(this).val();
        // Make AJAX request to fetch sorted results
        $.ajax({
            url: '/sort',
            method: 'GET',
            data: { criteria: criteria },
            success: function(response) {
                // Update the results section with the sorted results
                $('#results').html(response);
            },
            error: function(xhr, status, error) {
                console.error('Error sorting results:', error);
            }
        });
    });
});
