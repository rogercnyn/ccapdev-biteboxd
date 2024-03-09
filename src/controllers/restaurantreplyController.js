
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

module.exports = { addBulkRestaurantReply, readReply }