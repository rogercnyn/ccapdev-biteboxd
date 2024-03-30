
const RestaurantReply = require('../models/RestaurantReply.js');
const Review = require('../models/Review.js');
const Restaurant = require('../models/Restaurant.js');

async function countRestaurantReplies() {
    try {
        const count = await RestaurantReply.countDocuments();
        console.log(`Number of documents in the Restaurant Replies collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}

async function readReply(id) {
    try {
        const reply = await RestaurantReply.findById(id).select().exec();
        return reply ? reply.replies : [];
    } catch (error) {
        console.error(error);
        throw error;
    }

}

async function clearRestaurants() {
    try {
        await RestaurantReply.deleteMany({});
        await countRestaurantReplies();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}


async function addBulkRestaurantReply(parsedJson){
    try {
        await clearRestaurants(); 
        console.log("Inserting Restaurant Replies...")
        await RestaurantReply.insertMany(parsedJson)
        await countRestaurantReplies();

    } catch (error) {
        console.error('Error loading restaurant replies:', error);
    }
}


async function handleCreateRestaurantReply(req, res) {
    console.log("Creating a restaurant reply")
    const restaurantId = req.params._restaurantId;
    const reviewId = req.params._reviewId;
    const { body } = req.body;

    const review = await Review.findById(reviewId);

    console.log(review)
    
    if (!review) {
        return res.status(404).send({ message: 'Review not found' });
    } else {

        const reply = new RestaurantReply({
            restaurantId,
            reviewId,
            body
        });

        review.replies.push(reply._id)
    
        try {
            await reply.save(); 
            await review.save();
            res.status(201).send({ message: 'Reply saved successfully', replyId: reply._id });
        } catch (error) {
            console.error('Error saving restaurant reply:', error);
            res.status(500).send('Error saving reply');
        }
    }

}

async function handleEditRestaurantReply(req, res) {
    console.log("Editing a restaurant reply")
    const replyId = req.params._replyId;

    const { body } = req.body;

    try {
        const reply = await RestaurantReply.findById(replyId);
 
        if (!reply) {
            return res.status(404).send({ message: 'Reply not found' });
        }

        reply.body = body;
        await reply.save();
        res.send({ message: 'Reply updated successfully' });
    }
    catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).send('Error updating reply');
    }
    console.log("HEREE")
}


module.exports = { addBulkRestaurantReply, readReply, handleCreateRestaurantReply, handleEditRestaurantReply }