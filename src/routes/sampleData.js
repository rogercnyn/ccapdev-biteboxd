const Restaurant = require('../models/Restaurant.js');
const Profile = require('../models/Profile.js');
const Review = require('../models/Review.js');
const RestaurantReply = require('../models/RestaurantReply.js');


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
    location: 'Taft Avenue, Manila',
    username: 'jollibee_taft',
    password: 'bidaangsaya2024',
    startPriceRange: 50,
    endPriceRange: 1000,
    description: 'Home of the best Pinoy fried chicken.',
    shortDescription: 'Chicken joy',
    amenities: [1, 0, 1, 0, 
                1, 0, 1, 0,
                0, 1, 0, 1],
    tag: ['Filipino', 'Fastfood'],
    rating: 4.7,
    numberOfReviews: 48,
    noOfFiveStars: 10,
    noOfFourStars: 1,
    noOfThreeStars: 22,
    noOfTwoStars: 13,
    noOfOneStars: 2,
    media: 'burgerking.jpg',
    coordinates: [-73.968285, 40.785091]

    // reviews: blank muna
    // start and end opening hour: naka.now muna
});

const sampleProfile = new Profile({
    username: 'Makowa',
    image: 'avatar-f1.jpg',
    bgImage: 'header.jpg',
    firstName: 'Mako',
    lastName: 'Pangan',
    bio: 'Has the best taste in Taft!',
    hearts: 712,
    dislike: 6,
    credibility: 99,
    // reviews: blank muna
    // liked reviews: blank muna
});

const sampleReview = new Review({
    username: sampleProfile._id,
    linkToUsername: 'own-profile.hbs',
    overallRating: 4,
    foodRating: 4,
    serviceRating: 5,
    affordabilityRating: 3,
    noOfLikes: 10,
    noOfDislikes: 2,
    title: 'Sample Review Title',
    body: 'This is a sample review body text.',
    media: ['bacsilog1.png', 'bacsilog2.jpeg']

    // replies: blank muna
    // replies: sampleRestaurantReply._id
});

const sampleRestaurantReply = new RestaurantReply({
    restaurantId: sampleRestaurant._id,
    body: 'Thank you for visiting our resto! <3',
    media: ['bacsilog3.jpeg', 'bacsilog5.jpg']
});

module.exports = {
        sampleRestaurant, 
        sampleProfile,
        sampleReview,
        sampleRestaurantReply
        }