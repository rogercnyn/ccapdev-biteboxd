const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const restaurantSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() 
    },

    name: {type: String, required: true, unique: true},
    location: {type: String, required: true, unique: true},

    username: {type: String, required: true},
    password: {type: String, required: true},

    startPriceRange: {type: Number, required: true},
    endPriceRange: {type: Number, required: true},

    startOpeningHour: {type: Date, default: Date.now },
    endOpeningHour: {type: Date, default: Date.now },

    description: {type: String, required: true},

    attribute: { type: [Number], required: true },
    tag: { type: [String], required: true },

    noOfFiveStars: {type : Number, required: true},
    noOfFourStars: {type : Number, required: true},
    noOfThreeStars: {type : Number, required: true},
    noOfTwoStars: {type : Number, required: true},
    noOfOneStars: {type : Number, required: true},
});

const Restaurant = model('restaurant', restaurantSchema); 

module.exports = Restaurant;