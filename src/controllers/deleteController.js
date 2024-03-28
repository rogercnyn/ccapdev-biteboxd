const Review  = require('../models/Review.js');
const Restaurant = require('../models/Restaurant.js');
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

        res.redirect('/');

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

async function removeReviewFromRestaurant(reviewId, restaurantId) {
    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            console.log('Restaurant not found');
            return;
        }
        restaurant.reviews = restaurant.reviews.filter(id => id.toString() !== reviewId);
        restaurant.save();
    } catch (error) {
        console.error('Error removing review from restaurant:', error);
    }
}


async function deleteReview(req, res) {
    const reviewId = req.params._reviewId;
    const restaurantId = req.params._id;

    const username = req.session.username;

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            console.log("Review not found")
            return res.status(404).send({ success: false, message: "Review not found" });
        }

        removeReviewFromProfile(reviewId, username);
        removeReviewFromRestaurant(reviewId, restaurantId);

        res.send({ success: true, message: "Review deleted" });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }

}



module.exports = { deleteRestaurant, deleteReview };