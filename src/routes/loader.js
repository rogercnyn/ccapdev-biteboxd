

const { addProfile, clearProfiles } = require('./profileController.js');
const { addRestaurant } = require('./restaurantController.js');
const { addReview, clearReviews } = require('./reviewController.js');

function parseProfiles(){
    const fs = require('fs');
	let rawdata = fs.readFileSync('data/ProfileData.json');
	return JSON.parse(rawdata);
}

function parseRestaurants(){
    const fs = require('fs');
	let rawdata = fs.readFileSync('data/RestaurantData.json');
	return JSON.parse(rawdata)['Restaurant'];
}

function parseReviews(){
    const fs = require('fs')
	let rawdata = fs.readFileSync('data/ReviewData.json');
	return JSON.parse(rawdata);    
}


async function loadProfiles() {
    try {
        await clearProfiles(); 
        let profiles = parseProfiles()
        Array.from(profiles).forEach(profile => {
            addProfile(profile)
        })
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}


function loadRestaurant(){
    let restaurants = parseRestaurants()
    Array.from(restaurants).forEach(restaurant => {
        addRestaurant(restaurant)
    })

}

async function loadReviews() {
    try {
        await clearReviews(); 
        const reviews = parseReviews(); 
        reviews.forEach(review => {
            addReview("randomid", review); 
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

module.exports = { loadProfiles, loadRestaurant, loadReviews }