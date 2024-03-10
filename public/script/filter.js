function applyFilters() {
    // Example: Get values from your form fields
    const rating = document.querySelector('.slider-star-rating.selected').getAttribute('data-value'); // Assuming your stars add a 'selected' class and have data-value attributes
    const city = document.getElementById('cityInput').value; // Assuming you have an input with ID 'cityInput'
    const minReviewers = document.getElementById('minReviewersInput').value; // And an input for minReviewers

    fetch(`/api/search/filter?rating=${rating}&city=${city}&minReviewers=${minReviewers}`, {
        method: 'GET', // Or 'POST', depending on how your server expects to receive the request
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data, e.g., update the DOM with the filtered results
        console.log(data); // This is where you'd actually implement functionality to update your results section
    })
    .catch(error => console.error('Error fetching filtered results:', error));
}


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('applyFilter').addEventListener('click', function() {
        applyFilters();
        });
    });