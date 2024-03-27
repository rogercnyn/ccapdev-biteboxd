const Review  = require('../models/Review.js');

const { addAReviewToRestaurant } = require('./restaurantController.js')
const { addReviewToProfile, modifyLikeDislikeReview } = require('./profileController.js')

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

async function getReply(id) {
    try {
        const review = await Review.findById(id).select("replies").populate('replies').exec();
        return review ? review.replies : [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function populateReplies(restaurant) {
    for (let i = 0; i < restaurant.reviews.length; i++) {
        restaurant.reviews[i] = await Review.populate(restaurant.reviews[i], { path: 'replies' });
    }
    return restaurant
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

async function handleCreateReviewRequest(req, res) {
    console.log("Creating a review")
    const restaurantId = req.params._id;
    let reviewData = {
        username: req.session.username,
        body: req.body.reviewHtml,
        foodRating: req.body.foodRating,
        serviceRating: req.body.serviceRating,
        affordabilityRating: req.body.affordabilityRating,
        title: req.body.title,
    };

    console.log(reviewData)
    createReview(reviewData, restaurantId);

    res.send({ success: true, message: "Review created" });
}

async function createReview(reviewData, restaurantId){
    let reviewDocument = new Review(reviewData);

    let savedReview = await saveReview(reviewDocument);
    // console.log(savedReview['id'], restaurantId)
    addAReviewToRestaurant(restaurantId, savedReview['id'])
    addReviewToProfile(reviewData.username, savedReview['id'])
}

async function handleLikeReviewRequest(req, res) {
    const reviewId = req.params._reviewId;
    const username = req.session.username;
    const { like, dislike } = req.query;

    // console.log("Liking a review: ", reviewId);
    // console.log("Like: ", like, "\tDislike: ", dislike);

    
    try {
        await Review.findByIdAndUpdate(reviewId, { $inc: { noOfLikes: like, noOfDislikes: dislike } }, { new: true });


        modifyLikeDislikeReview(username, reviewId, like, dislike)

        res.send({ success: true}); 
    } catch (error) {
        console.log(error)
    }

    
}

async function deleteReviewByBulk(reviewIds) {
    try {
        const currentDate = new Date();
        for (const reviewId of reviewIds) {
            await Review.findByIdAndUpdate(
                reviewId,
                { $set: { deletedAt: currentDate } },
                { new: true } 
            );
            console.log("Deleted review: ", reviewId);
        }
    } catch (error) {
        console.error('Error updating review updatedAt attributes:', error);
        throw error;
    }
}


module.exports = { addBulkReview, getReply, populateReplies, handleCreateReviewRequest, handleLikeReviewRequest, deleteReviewByBulk }