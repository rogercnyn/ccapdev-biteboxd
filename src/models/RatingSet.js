const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const ratingSetSchema = new Schema({
    //restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, unique: true},
    //overallRating: {type: Schema.Types.ObjectId, ref: 'Review', required: true},

    noOfRatings: {type: Number, required: true}
});

const RatingSet = model('ratingset', ratingSetSchema); 

module.exports = RatingSet;