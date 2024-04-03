const { Schema,  model } = require('mongoose');

const restaurantReplySchema = new Schema({
    restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},

    body: {type: String, required: true},

    createdAt: { type: Date, default: Date.now },

    editedAt: { type: Date, default: null },
});

const RestaurantReply = model('restaurantreply', restaurantReplySchema); 

module.exports = RestaurantReply;