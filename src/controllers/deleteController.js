const Review  = require('../models/Review.js');
const Restaurant = require('../models/Restaurant.js');
const RestaurantReply = require('../models/RestaurantReply.js');

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

module.exports = { deleteRestaurant };