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
    name: 'Ate Rica\'s',
    location: 'Vito Cruz, Metro Manila, Philippines',
    username: 'atericas_taft',
    password: 'theOGrica',
    startPriceRange: 125,
    endPriceRange: 175,
    description: 'Ate Rica\'s Bacsilog offers different types of silog meals at an affordable price. The best sellers are bacsilog, tapsilog, and hotsilog.',
    shortDescription: 'Your new go-to Bacsilog-an',
    amenities: [1, 1, 1,
                1, 0, 1,
                1, 1, 0,
                1, 1, 1],
    tag: ['Filipino', 'Fastfood'],
    rating: 4.0,
    numberOfReviews: 64,
    noOfFiveStars: 20,
    noOfFourStars: 15,
    noOfThreeStars: 10,
    noOfTwoStars: 8,
    noOfOneStars: 11,
    media: 'bacsilog-main.jpeg',

    // X, Y 
    coordinates: [14.566420908001565, 120.99256453262059]

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