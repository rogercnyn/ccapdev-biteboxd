const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const profileSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() 
    },

    // username
    username: { type: String, required: true, unique: true}, 

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
    bio: { type: String, required: false}
});

const Profile = model('profile', profileSchema); 

module.exports = Profile;