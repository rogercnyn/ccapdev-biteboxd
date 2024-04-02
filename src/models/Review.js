const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const reviewSchema = new Schema({
    username: { type: String, required: false},

    // Ratings
    foodRating: { type: Number, required: true },
    serviceRating: { type: Number, required: true },
    affordabilityRating: { type: Number, required: true },

    // Counters
    noOfLikes: { type: Number, default: 0 },
    noOfDislikes: { type: Number, default: 0 },

    // Content
    title: { type: String, required: true },
    body: { type: String, required: false },

    // Media
    media: { type: [String], required: true },
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: null },

    // Replies
    replies: {type: [Schema.Types.ObjectId], ref: 'RestaurantReply', default: []}
});


reviewSchema.virtual('overallRating').get(function() {
    const sum = this.foodRating + this.serviceRating + this.affordabilityRating;
    const average = (sum / 3) * 100;
    return Math.round(average, 2)/100;
});


reviewSchema.set('toObject', { virtuals: true });
reviewSchema.set('toJSON', { virtuals: true });


const Review = model('review', reviewSchema); 

module.exports = Review;