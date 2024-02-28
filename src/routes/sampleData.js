const Restaurant = require('../models/Restaurant.js');
const Profile = require('../models/Profile.js');
const RestaurantReply = require('../models/RestaurantReply.js');
const Review = require('../models/Review.js');


function dropAll(){
    RestaurantReply.collection.drop();
    Review.collection.drop();
    Profile.collection.drop();
    Restaurant.collection.drop();
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
    attribute: [1, 0, 1, 0, 
                1, 0, 1, 0,
                0, 1, 0, 1],
    tag: ['Filipino', 'Fastfood'],
    noOfFiveStars: 10,
    noOfFourStars: 1,
    noOfThreeStars: 22,
    noOfTwoStars: 13,
    noOfOneStars: 2
});

const sampleProfile = new Profile({
    username: 'Makowa',
    image: 'pic1.jpg',
    bgImage: 'pic1.jpg',
    firstName: 'Mako',
    lastName: 'Pangan',
    bio: 'Has the best taste in Taft!'
});

const sampleRestaurantReply = new RestaurantReply({
    restaurantId: sampleRestaurant._id,
    body: 'Thank you for visiting our resto! <3',
    isEdited: true
});

const sampleReview = new Review({
    username: sampleProfile._id,
    rating: 4,
    foodRating: 4,
    serviceRating: 5,
    affordabilityRating: 3,
    noOfLikes: 10,
    noOfDislikes: 2,
    title: 'Sample Review Title',
    body: 'This is a sample review body text.',
    media: ['media_url_1', 'media_url_2'],
    replies: sampleRestaurantReply._id
});

module.exports = {
        sampleRestaurant, 
        sampleProfile,
        sampleRestaurantReply,
        sampleReview}