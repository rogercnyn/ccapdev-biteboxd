const Review = require('../models/Review.js');
const { addAReviewToRestaurant } = require('./restaurantController.js')


function saveReview(reviewToSave) {
    return reviewToSave.save()
        .then(savedReview => {
            console.log('Sample review saved successfully:', savedReview);
            return savedReview; 
        })
        .catch(error => {
            console.error('Error saving sample review:', error);
            throw error; 
        });
}

function addAReview(restaurantId, reviewToSave){
    savedReview = saveReview(reviewToSave)
    addAReviewToRestaurant(restaurantId, savedReview['_id'])
}