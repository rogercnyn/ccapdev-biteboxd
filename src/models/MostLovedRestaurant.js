const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const mostLovedRestaurantSchema = new Schema({
    //restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    //reviewId: {type: Schema.Types.ObjectId, ref: 'Review', required: true},
    //username: {type: Schema.Types.ObjectId, ref: 'Profile', required: true},

    likedAt: { type: Date, default: Date.now },
    dislikedAt: { type: Date, default: null },
});

const MostLovedRestaurant = model('mostlovedrestaurant', mostLovedRestaurantSchema); 

module.exports = MostLovedRestaurant;