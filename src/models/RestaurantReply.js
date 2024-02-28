const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const restaurantReplySchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() 
    },

    restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},

    isEdited: {type: Boolean, required: false},

    body: {type: String, required: true},

    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
});

const RestaurantReply = model('restaurantreply', restaurantReplySchema); 

module.exports = RestaurantReply;