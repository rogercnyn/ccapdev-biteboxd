const mongoose = require('mongoose');
const Review = require('./Review');
const Restaurant = require('./Restaurant');
const Profile = require('./Profile');


function connect() {
    mongoose.connect(process.env.MONGODB_URI);
    mongoose.model('Review', Review.schema);
    mongoose.model('Restaurant', Restaurant.schema);
    mongoose.model('Profile', Profile.schema);
}

module.exports = connect;