

const { addProfile, clearProfiles } = require('./profileController.js');
const { addRestaurant, clearRestaurants, findRestaurantByName } = require('./restaurantController.js');
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


async function loadRestaurants(){
    try {
        // await clearRestaurants();
        // let restaurants = parseRestaurants()
        // restaurants.forEach(restaurant => {
            // addRestaurant(restaurant)
        // })
        console.log(findRestaurantByName("Ate"))
    } catch (error) {
        console.error('Error loading restaurants:', error)
    }

}

// do not use this for adding when in interface
async function loadReviews() {
    try {
        await clearReviews(); 
        const reviews = parseReviews(); 
        reviews.forEach(review => {
            id = addReview("idCanOnlyBeDoneInBackend", review);
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

module.exports = { loadProfiles, loadRestaurants, loadReviews }