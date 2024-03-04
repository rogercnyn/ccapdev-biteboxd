const Review  = require('../models/Review.js')

const { addAReviewToRestaurant } = require('./restaurantController.js')
const { addReviewToProfile } = require('./profileController.js')

async function countReviews() {
    try {
        const count = await Review.countDocuments();
        console.log(`Number of documents in the Review collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}

async function clearReviews() {
    try {
        await Review.deleteMany({});
        await countReviews();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}


function saveReview(reviewToSave) {
    return reviewToSave.save()
        .then(savedReview => {
            // console.log('Review saved successfully:', savedReview);
            return savedReview; 
        })
        .catch(error => {
            console.error('Error saving sample review:', error);
            throw error; 
        });
}

async function addBulkReview(parsedJson){
    try {
        await clearReviews(); 
        console.log("Inserting reviews...")
        await Review.insertMany(parsedJson)
        await countReviews();
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}



module.exports = { addBulkReview }