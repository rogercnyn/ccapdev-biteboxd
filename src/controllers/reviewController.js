const Review  = require('../models/Review.js');

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

async function getReply(username) {
    try {
        const review = await Review.findOne({"username": username}).select('replies').exec();
        return review ? review.replies : [];
    } catch (error) {
        console.error(error);
        throw error;
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
        console.log("Inserting reviews...");
        
        const insertedDocs = await Review.insertMany(parsedJson);
        
       
        await countReviews();
    } catch (error) {
        console.error('Error loading reviews:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}





module.exports = { addBulkReview, getReply }