const Review  = require('../models/Review.js');

const { addAReviewToRestaurant, editAReviewInRestaurant } = require('./restaurantController.js')
const { addReviewToProfile, modifyLikeDislikeReview, getProfilePicture } = require('./profileController.js');
const Profile = require('../models/Profile.js');
const Restaurant = require('../models/Restaurant.js');

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
    const filenames = req.files.map(file => file.filename);

    let reviewData = {
        username: req.session.username,
        body: req.body.reviewHtml,
        foodRating: req.body.foodRating,
        serviceRating: req.body.serviceRating,
        affordabilityRating: req.body.affordabilityRating,
        title: req.body.title,
        media: filenames,
    };

    // console.log(reviewData)
    await createReview(reviewData, restaurantId);

    res.send({ success: true, message: "Review created" });
}

async function createReview(reviewData, restaurantId){
    let reviewDocument = new Review(reviewData);

    let savedReview = await saveReview(reviewDocument);
    // console.log(savedReview['id'], restaurantId);
    await addAReviewToRestaurant(restaurantId, savedReview['id'], parseInt(savedReview['overallRating']))
    await addReviewToProfile(reviewData.username, savedReview['id'])
}

async function handleLikeReviewRequest(req, res) {
    const reviewId = req.params._reviewId;
    const username = req.session.username;
    const { like, dislike } = req.query;



    
    try {
        let result = await Review.findByIdAndUpdate(reviewId, { $inc: { noOfLikes: like, noOfDislikes: dislike } }, { new: true });

        console.log(result)
        // console.log(like)
        // console.log("modifying like/dislike")
        modifyLikeDislikeReview(username, reviewId, like, dislike)

        res.send({ success: true}); 
    } catch (error) {
        console.log(error)
    }

    
}


async function handleEditReviewRequest( req, res) {
    const reviewId = req.params._reviewId;
    const restaurantId = req.params._restaurantId;
    const filenames = req.files.map(file => file.filename);
    const media = (req.body.existingMedia || []).concat(filenames || []);



    let reviewData = {
        body: req.body.reviewHtml,
        foodRating: req.body.foodRating,
        serviceRating: req.body.serviceRating,
        affordabilityRating: req.body.affordabilityRating,
        title: req.body.title,
        isEdited: true,
        media: media
    };



    try {
        const oldReview = await Review.findById(reviewId);
        const oldStar = parseInt(oldReview['overallRating'])

        const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });
        const updatedStar = parseInt(updatedReview['overallRating'])

        if (!updatedReview) {
            console.log("Review not found")
            res.status(404).send({ success: false, message: "Review not found" });
        } else {
            editAReviewInRestaurant(restaurantId, updatedStar, oldStar)
            res.send({ success: true, message: "Review edited", review: updatedReview });

        }

    } catch (error) {
        console.log(error)
        console.error('Error editing review:', error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }
}


async function processReview(review, username, loggedIn, likedReviews, dislikedReviews){   
    // manuall add the virtual property
    let r = await Review.findById(review['_id'])
    let restaurants = await Restaurant.findOne({ reviews: review['_id'] })
    let profile = await Profile.findOne({ username: review['username'] })

    review['longText'] = review['body'].slice(0, 230);
    review['fullText'] = review['body'].slice(230);
    review['hasNoSeeMore'] = review['fullText'].length === 0
    
    review['overallRating'] = r['overallRating']
    review['isOwnReview'] = (review['username'] === username) 
    review['loggedIn'] = loggedIn
    review['restaurantId'] = restaurants['_id']
    review['profilePicture'] = profile['image']
    review['isLiked'] = likedReviews.includes(review['_id'].toString())
    review['isDisliked'] = dislikedReviews.includes(review['_id'].toString())


    review['replies'].forEach((reply) => {
        reply['media'] = restaurants['media'];
        reply['name'] = restaurants['name'];
        reply['reviewId'] = review['_id']
    })
    
    return review

}






module.exports = { processReview, addBulkReview, handleCreateReviewRequest, handleLikeReviewRequest, handleEditReviewRequest }