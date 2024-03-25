const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const profileSchema = new Schema({

    // information
    username: { type: String, required: true, unique: true}, 
    password: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    tasteProfile: {type: [String], required: true},

    // images
    image: { type: String, required: true },
    bgImage: {type: String, required: false},

    // createdAt 
    createdAt: {type: Date, default: Date.now },

    // deleted
    deletedAt: {type: Date, default: null},

    // name
    firstName: { type: String, required: true}, 
    lastName: { type: String, required: true}, 

    // bio
    bio: { type: String, required: false},

    // stats
    hearts: {type: Number, default: '', required: true},
    dislike: {type: Number, default: '',required: true},
    credibility: {type: Number, default: '',required: true},

    // reviews
    reviews: {type: [Schema.Types.ObjectId], ref: 'Review', default: []},
    likedReviews: {type: [Schema.Types.ObjectId], ref: 'Review', default: []},
    dislikedReviews: {type: [Schema.Types.ObjectId], ref: 'Review', default: []}
});

const Profile = model('profile', profileSchema); 

module.exports = Profile;