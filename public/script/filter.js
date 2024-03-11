function applyFilters() {
    // Retrieve the rating based on the selected stars
    const rating = 2
    
    
    // [...document.querySelectorAll('.slider-star-rating')]
    //                     .filter(star => star.classList.contains('selected'))
    //                     .map(star => star.dataset.value)[0]; // Assuming 'selected' class and 'data-value' attribute handling

    // Using the new IDs for city, minReviewers, and assuming a method to get priceRange value
    const city = document.getElementById('city-filter').value;
    const minReviewers = document.getElementById('min-review-filter').value;
    // Assuming a method exists to calculate priceRange from the slider's selected value(s)
    const priceRange = 2 //sample value

    //Assuming foodQuality and serviceQuality are handled similarly
    const foodQuality = document.getElementById('food-quality-filter').value;
    const serviceQuality = document.getElementById('service-quality-filter').value;

    fetch(`/api/search/filter?rating=${rating}&city=${encodeURIComponent(city)}&minReviewers=${minReviewers}&priceRange=${priceRange}&foodQuality=${foodQuality}&serviceQuality=${serviceQuality}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        updateDOMWithResults(data); // Ensure this updates your results container
    })
    .catch(error => {
        console.error('Error fetching filtered results:', error);
        // Consider displaying this error to the user
    });
}


function updateDOMWithResults(data) {
    const resultsContainer = document.getElementById('results'); // Assume this is your container for the results
    resultsContainer.innerHTML = ''; // Clear current results

    // Check if we have results
    if (data.results && data.results.length > 0) {
        data.results.forEach(result => {
            // Create and append elements for each result
            // This is a simple example, adjust according to your actual result structure
            const element = document.createElement('div');
            element.textContent = result.name; // Example property
            resultsContainer.appendChild(element);
        });
    } else {
        // Handle case of no results found
        resultsContainer.textContent = 'No results found.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('applyFilter').addEventListener('click', applyFilters);
});