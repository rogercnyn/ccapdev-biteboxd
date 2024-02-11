// Get all the elements with the class "resto-profile"
const restoProfiles = document.querySelectorAll('.resto-profile');

// Loop through each resto profile
restoProfiles.forEach(profile => {
    // Get the rating span element inside this profile
    const ratingSpan = profile.querySelector('.count');

    // Get the count from the rating span element
    const ratingCount = parseFloat(ratingSpan.textContent);

    // Get the star elements inside this profile
    const stars = profile.querySelectorAll('.star');

    // Calculate the number of filled stars based on the rating count
    const filledStars = Math.round(ratingCount);

    // Loop through each star and fill or empty it based on the rating count
    stars.forEach((star, index) => {
        if (index < filledStars) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
});
