

const { addBulkProfile } = require('./profileController.js');
const { addBulkResto } = require('./restaurantController.js');
const { addBulkReview } = require('./reviewController.js');
const fs = require('fs')

const profileJson = 'data/biteboxd.profile.json'
const restaurantJson = 'data/biteboxd.restaurant.json'
const reviewJson = 'data/biteboxd.review.json'

function parseJson(pathToJson){
    return JSON.parse(fs.readFileSync(pathToJson))
}


async function loadProfiles() {
    addBulkProfile(parseJson(profileJson))
}


async function loadRestaurants() {
    addBulkResto(parseJson(restaurantJson))
}

async function loadReviews() {
    addBulkReview(parseJson(reviewJson))
}

  
module.exports = { loadProfiles, loadRestaurants, loadReviews }