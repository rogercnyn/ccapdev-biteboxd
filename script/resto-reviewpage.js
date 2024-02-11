let starsContainers = document.querySelectorAll(".star-sorting");
let currentRatings = {
    food: 0,
    service: 0,
    price: 0,
};

document.addEventListener("DOMContentLoaded", function () {
    var quill = new Quill('#editor', {
        theme: 'snow',
        height: 120,
        placeholder: 'Type here your review!'
    });
});

function addRating(criterion, n) {
    currentRatings[criterion] = n;
    updateStars();
}

function updateStars() {
    starsContainers.forEach(container => {
        const criterion = container.dataset.criterion;
        const stars = container.children;

        Array.from(stars).forEach((star, index) => {
            star.classList.toggle("colored", index < currentRatings[criterion]);
        });
    });
}

starsContainers.forEach(container => {
    container.addEventListener("mouseenter", function (event) {
        const criterion = container.dataset.criterion;
        const index = Array.from(container.children).indexOf(event.target);

        currentRatings[criterion] = index + 1;
        updateStars();
    });

    container.addEventListener("mouseleave", function () {
        updateStars();
    });

    container.addEventListener("click", function (event) {
        const criterion = container.dataset.criterion;
        const index = Array.from(container.children).indexOf(event.target);

        currentRatings[criterion] = index + 1;
        updateStars();
    });
});
