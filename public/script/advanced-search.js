// Get the filter elements
const ratingFilter = document.querySelector('.star-sorting');
const cityFilter = document.querySelector('.input-filter');
const minReviewersFilter = document.querySelector('.input-filter');
const foodQualityFilter = document.querySelector('.green.box');
const serviceFilter = document.querySelector('.green.box');

// Add event listeners to the filter elements
ratingFilter.addEventListener('click', filterResults);
cityFilter.addEventListener('input', filterResults);
minReviewersFilter.addEventListener('input', filterResults);
foodQualityFilter.addEventListener('click', filterResults);
serviceFilter.addEventListener('click', filterResults);

// Function to filter the results
function filterResults() {
    // Get the selected values from the filter elements
    const selectedRating = ratingFilter.querySelectorAll('.slider-star-rating.selected').length;
    const selectedCity = cityFilter.value.trim().toLowerCase();
    const selectedMinReviewers = parseInt(minReviewersFilter.value) || 0;
    const selectedFoodQuality = foodQualityFilter.classList.contains('selected');
    const selectedService = serviceFilter.classList.contains('selected');

    // Get all the result boxes
    const resultBoxes = document.querySelectorAll('.result-box');

    // Loop through each result box and apply the filters
    resultBoxes.forEach((resultBox) => {
        const rating = parseInt(resultBox.querySelector('.stars').childElementCount);
        const city = resultBox.querySelector('.caption').textContent.toLowerCase();
        const numberOfReviews = parseInt(resultBox.querySelector('.rating-text').textContent.match(/\d+/)[0]);
        const foodQuality = resultBox.querySelector('.categories .green.box').classList.contains('selected');
        const service = resultBox.querySelector('.categories .green.box').classList.contains('selected');

        // Check if the result box should be displayed based on the filters
        const shouldDisplay =
            (selectedRating === 0 || rating >= selectedRating) &&
            (selectedCity === '' || city.includes(selectedCity)) &&
            (selectedMinReviewers === 0 || numberOfReviews >= selectedMinReviewers) &&
            (!selectedFoodQuality || foodQuality) &&
            (!selectedService || service);

        // Show/hide the result box based on the shouldDisplay value
        resultBox.style.display = shouldDisplay ? 'block' : 'none';
    });
}