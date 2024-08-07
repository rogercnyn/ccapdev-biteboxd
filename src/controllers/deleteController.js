const Review  = require('../models/Review.js');
const Restaurant = require('../models/Restaurant.js');
const { removeReviewFromRestaurant } = require('./restaurantController.js');
const RestaurantReply = require('../models/RestaurantReply.js');
const Profile = require('../models/Profile.js');

async function deleteReviewByBulk(reviewIds) {
    try {
        const result = await Review.deleteMany({ _id: { $in: reviewIds } });
        console.log("Deleted reviews: ", result.deletedCount);
    } catch (error) {
        console.error('Error deleting reviews:', error);
        throw error;
    }
}

async function deleteRestoReplyByBulk(restaurantId) {
    try {
        const result = await RestaurantReply.deleteMany({ restaurantId: restaurantId });
        console.log(`Deleted documents with restaurant ID: ${restaurantId}. Count: ${result.deletedCount}`);
    } catch (error) {
        console.error(`Error deleting documents for restaurant ID ${restaurantId}:`, error);
        throw error;
    }
}

async function deleteRestaurant(req, res) {
    try {
        const { id } = req.params;
        console.log("The restaurant id is:", id);

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const reviewIds = restaurant.reviews;
      
        console.log('Review IDs associated with the restaurant:', reviewIds);

        //Delete resto
        await Restaurant.findByIdAndDelete(id);

        // delete the review under resto also
        // from reviewController.js
        await deleteReviewByBulk(reviewIds);

        // delete the replies made by the restaurant
        // from restaurantreplyController.js
        await deleteRestoReplyByBulk(id);

        
        res.redirect('/logout');

    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function removeReviewFromProfile(reviewId, username) {
    try {
        const profile = await Profile.findOne({ username: username });
        const profiles = await Profile.find({});

        if (!profile) {
            console.log('Profile not found');
            return;
        }

        // first delete it in the owner
        profile.reviews = profile.reviews.filter(id => id.toString() !== reviewId);

        // delete it in everyone else's like
        profiles.forEach(async (profile) => {
            profile.likedReviews = profile.likedReviews.filter(id => id.toString() !== reviewId);
            profile.dislikedReviews = profile.dislikedReviews.filter(id => id.toString() !== reviewId);
            profile.save();
        });

        profile.save();
    } catch (error) {
        console.error('Error removing review from profile:', error);
    }
    
}

async function deleteReview(req, res) {
    const reviewId = req.params._reviewId;
    const restaurantId = req.params._restaurantId;

    const username = req.session.username;

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        const oldStar = parseInt(deletedReview['overallRating']);

        if (!deletedReview) {
            console.log("Review not found")
            return res.status(404).send({ success: false, message: "Review not found" });
        }

        removeReviewFromProfile(reviewId, username);
        removeReviewFromRestaurant(reviewId, restaurantId, oldStar);

        res.send({ success: true, message: "Review deleted" });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }

}

async function deleteProfile(req, res) {
    try {
        const { username } = req.params;
        console.log('Deleting profile:', username);

        const profile = await Profile.findOne({ username });

        if (!profile) {
            console.log('Profile not found');
            return res.status(404).json({ message: 'Profile not found' });
        }

        const reviewIds = profile.reviews;

        console.log('Deleting reviews:', reviewIds);
        await deleteReviewByBulk(reviewIds);


        const profiles = await Profile.find({});
        for (const p of profiles) {
            // remove from the likes and dislikes of OTHER profile the review of the deleted profile
            p.likedReviews = p.likedReviews.filter(id => !reviewIds.includes(id.toString()));
            p.dislikedReviews = p.dislikedReviews.filter(id => !reviewIds.includes(id.toString()));
            await p.save();
        }

        for (const likedReview of profile.likedReviews) {
            await Review.findByIdAndUpdate(likedReview['_id'], { $inc: { noOfLikes: -1, noOfDislikes: 0 } }, { new: true });
        }

        for (const dislikedReview of profile.dislikedReviews) {
            await Review.findByIdAndUpdate(dislikedReview['_id'], { $inc: { noOfLikes: 0, noOfDislikes: -1 } }, { new: true });
        }

        await Profile.findOneAndDelete({ username });

        res.json({ success: true, message: 'Profile and associated reviews deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteReply(req, res) {
    try {
        const replyId = req.params._replyId;
        const reviewId = req.params._reviewId;

        await RestaurantReply.findByIdAndDelete(replyId);
        const review = await Review.findById(reviewId);

        review.replies = review.replies.filter(reply => reply.toString() !== replyId);
        await review.save();
        res.send({ success: true, message: "Reply deleted" });
    } catch (error) {
        console.error('Error deleting reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}


module.exports = { deleteRestaurant, deleteReview, deleteProfile, deleteReply }