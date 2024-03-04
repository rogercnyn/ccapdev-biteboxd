

const { addBulkProfile } = require('../controllers/profileController.js');
const { addBulkResto } = require('../controllers/restaurantController.js');
const { addBulkReview } = require('../controllers/reviewController.js');
const { addBulkRestaurantReply } = require('../controllers/restaurantreplyController.js');

const fs = require('fs')

const profileJson = 'data/biteboxd.profile.json'
const restaurantJson = 'data/biteboxd.restaurant.json'
const reviewJson = 'data/biteboxd.review.json'
const restaurantReplyJson = 'data/biteboxd.restaurantreply.json'

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

async function loadRestaurantReplies() {
    addBulkRestaurantReply(parseJson(restaurantReplyJson))
}

  
module.exports = { loadProfiles, loadRestaurants, loadReviews, loadRestaurantReplies }