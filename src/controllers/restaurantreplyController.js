
const RestaurantReply = require('../models/RestaurantReply.js');

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

async function addRestaurantReply(req, res) {
    try {
        const { restaurantId } = req.params;
        const { body, media } = req.body; // Assuming body and media are sent in the request
        const isEdited = false; // Default value for isEdited
        const reply = new RestaurantReply({
            restaurantId,
            body,
            media,
            isEdited,
            createdAt: new Date(), // Set current time as creation time
            deletedAt: null // Initially, the reply is not deleted
        });

        await reply.save(); // Save the reply to the database
        res.status(201).send({ message: 'Reply saved successfully', replyId: reply._id });
    } catch (error) {
        console.error('Error saving restaurant reply:', error);
        res.status(500).send('Error saving reply');
    }
}

async function deleteRestoReplyByBulk(restaurantId) {
    try {
        const currentDate = new Date();
        await RestaurantReply.updateMany({ restaurantId: restaurantId }, { $set: { deletedAt: currentDate } });
        console.log(`DeletedAt updated for documents with restaurant ID: ${restaurantId}`);
    } catch (error) {
        console.error(`Error updating deletedAt for restaurant ID ${restaurantId}:`, error);
        throw error;
    }
}

module.exports = { addBulkRestaurantReply, readReply, addRestaurantReply, deleteRestoReplyByBulk }