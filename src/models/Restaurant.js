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

    //rating: {type: Schema.Types.ObjectId, ref: 'RatingSet', required: true},

    startPriceRange: {type: Number, required: true},
    endPriceRange: {type: Number, required: true},

    startOpeningHour: {type: Date, default: Date.now },
    endOpeningHour: {type: Date, default: Date.now },

    description: {type: String, required: true},

    attribute: { type: [String], required: true },
    tag: { type: [String], required: true },
});

const Restaurant = model('restaurant', restaurantSchema); 

module.exports = Restaurant;