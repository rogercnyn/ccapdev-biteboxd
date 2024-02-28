
const Restaurant = require('../models/Restaurant.js');
const Review = require('../models/Review.js');
const Profile = require('../models/Profile.js');
const RestaurantReply = require('../models/RestaurantReply.js');
const RatingSet = require('../models/RatingSet.js');


function dropAll(){
    Restaurant.collection.drop();
    RatingSet.collection.drop();
    Review.collection.drop();
}

// will automatically run when imported
dropAll();

const sampleRestaurant = new Restaurant({
    name: 'Jollibee',
    location: 'Taft Avenue',
    username: 'jollibee_taft',
    password: 'bidaangsaya2024',
    startPriceRange: 50,
    endPriceRange: 1000,
    description: 'Home of the best Pinoy fried chicken.',
    attribute: [1, 0, 1, 0 , 
                1, 0, 1, 0,
                0, 1, 0, 1],
    tag: ['Filipino', 'Fastfood']
});

const sampleRatingSet = new RatingSet({
    restaurantId: sampleRestaurant._id,
    noOfRatings: 5
});

// const sampleReview = new Review({
//     rating: 4,
//     foodRating: 4,
//     serviceRating: 5,
//     affordabilityRating: 3,
//     noOfLikes: 10,
//     noOfDislikes: 2,
//     title: 'Sample Review Title',
//     body: 'This is a sample review body text.',
//     media: ['media_url_1', 'media_url_2'],
// });


// const sampleRestaurantReply = new RestaurantReply({
//     body: 'SAMPLEEEEEEEEEEEEE',
//     isEdited: true
// });


// const sampleProfile = new Profile({
//     username: 'Makowa',
//     image: 'pic1.jpg',
//     bgImage: 'pic1.jpg',
//     firstName: 'Mako',
//     lastName: 'Pangan',
//     bio: 'Has the best taste in Taft!'
// });




module.exports = {
        sampleRestaurant, 
        sampleRatingSet}