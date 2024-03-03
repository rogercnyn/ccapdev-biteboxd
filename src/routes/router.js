const { Router } = require('express');
const path = require('path');
const fs = require('fs');

const { searchQuery, getAllRestaurant } = require('./restaurantController.js')

const router = Router();

const Restaurant = require('../models/Restaurant.js');


router.get('/all', function(req, resp){
    getAllRestaurant().then(results => {
            console.log(results)
            resp.render("all", {
                results: results    
            })
        }   
    )
})


router.get('/resto-reviewpage', function(req, resp){
    resp.render("resto-reviewpage")
})


router.get('/explore', function(req, resp){
    resp.render("explore")    
})

router.get('/search', function(req, resp){
    const query = req.query.query;
    console.log(query)
    searchQuery(query)
        .then(results => {
            console.log(results)
        resp.render("search", {
                results: results,
                query: query,
                hasResults: results.length !== 0
            });
        })
        .catch(error => {
            console.error('Error searching:', error);
            resp.status(500).send('Internal Server Error');
        });
});


router.get('/', function(req, resp){
    resp.render("index")
})


router.get('/index', function(req, resp){
    resp.render("index")
})

Restaurant.collection.drop()
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
    media: 'atericas.jpg',

    // X, Y 
    coordinates: [14.566420908001565, 120.99256453262059]

    // reviews: blank muna
    // start and end opening hour: naka.now muna
});


function saveSampleRestaurant() {
    return sampleRestaurant.save()
        .then(savedRestaurant => {
            console.log('Sample restaurant saved successfully:', savedRestaurant);
            return savedRestaurant; // Return the saved document
        })
        .catch(error => {
            console.error('Error saving restaurant review:', error);
            throw error; // Throw the error to propagate it
        });
}

// console.log(sampleRestaurant)
saveSampleRestaurant()
module.exports = router;