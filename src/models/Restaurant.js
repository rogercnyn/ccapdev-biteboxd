const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const restaurantSchema = new Schema({

    // core information
    name: {type: String, required: true},
    location: {type: String, required: true},

    //media
    media: {type: String, required: true},

    // login credentials of resto managers
    username: {type: String, required: true},
    password: {type: String, required: true},

    // coordinates for map
    coordinates: { type: [Number], required: true},

    // data about the pricing
    startPriceRange: {type: Number, required: true},
    endPriceRange: {type: Number, required: true},

    // data about the operating hours
    startOpeningHour: {type: Date, default: Date.now },
    endOpeningHour: {type: Date, default: Date.now },

    // description
    description: {type: String, required: true},
    shortDescription: {type: String, required: true},
    amenities: { type: [Number], required: true },
    tag: { type: [String], required: true },

    // statistics
    rating: {type : Number, required: true, default: 0},
    noOfReviews: {type : Number, required: true, default: 0},
    noOfFiveStars: {type : Number, required: true, default: 0},
    noOfFourStars: {type : Number, required: true, default: 0},
    noOfThreeStars: {type : Number, required: true, default: 0},
    noOfTwoStars: {type : Number, required: true, default: 0},
    noOfOneStars: {type : Number, required: true, default: 0},

    // reviews
    reviews: {type: [Schema.Types.ObjectId], ref: 'Review', default: []},

    // metadata
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },

});

const Restaurant = model('restaurant', restaurantSchema); 

module.exports = Restaurant;