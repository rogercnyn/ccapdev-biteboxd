const { Router }= require('express');
const path = require('path');
const fs = require('fs');
const Review = require('../models/Review.js');
const Profile = require('../models/Profile.js');
const Restaurant = require('../models/Restaurant.js');
const RestaurantReply = require('../models/RestaurantReply.js');
const RatingSet = require('../models/RatingSet.js');
const MostLovedRestaurant = require('../models/MostLovedRestaurant.js');

const router = Router();
const viewsDir = path.join(path.resolve(__dirname, '..'), 'views');
const htmlFiles = fs.readdirSync(viewsDir) .filter(file => path.extname(file) === '.html');

function routeToFile(fileName) {
    return async function(req, res) {
        const filePath = path.join(viewsDir, fileName);
        res.sendFile(filePath);
    };
}


console.log(htmlFiles)
htmlFiles.forEach(fileName => 
    router.get(`/${fileName}`, routeToFile(fileName))    
)


router.get('/', routeToFile('index.html'));


const sampleRestaurantReply = new RestaurantReply({
    body: 'SAMPLEEEEEEEEEEEEE',
    isEdited: true
});

const sampleReview = new Review({
    rating: 4,
    foodRating: 4,
    serviceRating: 5,
    affordabilityRating: 3,
    noOfLikes: 10,
    noOfDislikes: 2,
    title: 'Sample Review Title',
    body: 'This is a sample review body text.',
    media: ['media_url_1', 'media_url_2'],
});

const sampleProfile = new Profile({
    username: 'Makowa',
    image: 'pic1.jpg',
    bgImage: 'pic1.jpg',
    firstName: 'Mako',
    lastName: 'Pangan',
    bio: 'Has the best taste in Taft!'
});

const sampleRatingSet = new RatingSet({
    noOfRatings: 5
});

const sampleRestaurant = new Restaurant({
    name: 'Jollibee',
    location: 'Taft Avenue',
    username: 'jollibee_taft',
    password: 'bidaangsaya2024',
    startPriceRange: 50,
    endPriceRange: 1000,
    description: 'Home of the best Pinoy fried chicken.',
    attribute: ['Accepts E-Wallet', 'Outdoor dining'],
    tag: ['Filipino', 'Fastfood']
});

const sampleMostLovedRestaurant = new MostLovedRestaurant({
    // nothing here for now
});


// for debugging only, remove once implementation

Review.collection.drop();
Profile.collection.drop();
Restaurant.collection.drop();
RestaurantReply.collection.drop();
RatingSet.collection.drop();
MostLovedRestaurant.collection.drop();

// Save the document to the database

sampleRestaurantReply.save()
    .then(savedRestaurantReply => {
        console.log('Sample restaurant reply saved successfully:', savedRestaurantReply);
    })
    .catch(error => {
        console.error('Error saving restaurant reply review:', error);
    });

sampleMostLovedRestaurant.save()
    .then(savedMostLovedRestaurant => {
        console.log('Sample loved restaurant saved successfully:', savedMostLovedRestaurant);
    })
    .catch(error => {
        console.error('Error saving loved restaurant review:', error);
    });

sampleReview.save()
    .then(savedReview => {
        console.log('Sample review saved successfully:', savedReview);
    })
    .catch(error => {
        console.error('Error saving sample review:', error);
    });

sampleProfile.save()
    .then(savedProfile => {
        console.log('Sample profile saved successfully:', savedProfile);
    })
    .catch(error => {
        console.error('Error saving profile review:', error);
    });

sampleRestaurant.save()
    .then(savedRestaurant => {
        console.log('Sample restaurant saved successfully:', savedRestaurant);
    })
    .catch(error => {
        console.error('Error saving restaurant review:', error);
    });

sampleRatingSet.save()
    .then(savedRatingSet => {
        console.log('Sample rating set saved successfully:', savedRatingSet);
    })
    .catch(error => {
        console.error('Error saving rating set review:', error);
    });

module.exports = router;