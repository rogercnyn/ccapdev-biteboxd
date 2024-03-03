const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const reviewSchema = new Schema({
    // References
    reviewId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() 
    },

    username: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    linkToUsername: {type: String, required: true},
    isEdited: { type: Boolean, default: false },

    // Ratings
    overallRating: { type: Number, required: true },
    foodRating: { type: Number, required: true },
    serviceRating: { type: Number, required: true },
    affordabilityRating: { type: Number, required: true },

    // Counters
    noOfLikes: { type: Number, default: 0 },
    noOfDislikes: { type: Number, default: 0 },

    // Content
    title: { type: String, required: true },
    body: { type: String, required: true },

    // Media
    media: { type: [String], required: true },
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },

    // Replies
    replies: {type: [Schema.Types.ObjectId], ref: 'RestaurantReply', default: []}
});


const Review = model('review', reviewSchema); 

module.exports = Review;