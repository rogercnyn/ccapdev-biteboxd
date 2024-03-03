const Restaurant = require('../models/Restaurant.js');
const searchRequiredFields = { _id: 0, name: 1, location: 1, startPriceRange: 1, endPriceRange: 1, media: 1, rating: 1, numberOfReviews: 1, description: 1 }
const allPageRequiredFields = { _id: 0, name: 1, location: 1,  media: 1, rating: 1, shortDescription: 1, tag: 1 }

function floorTheRating(restaurants){
    restaurants.forEach(restaurant => {
        restaurant.stars = Math.floor(restaurant.rating)
        restaurant.noStars = 5-restaurant.stars
    });
    return restaurants
}

function getCuisine(restaurants){
    restaurants.forEach(restaurant => {
        restaurant.tag = restaurant.tag[0].substring(0, 3).toLowerCase()
    })
}

function searchQuery(searchTerm) {
    return Restaurant.find(
        {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }
            ]
        }, 
        searchRequiredFields
    )
    .lean() 
    .then(restaurants => {
        return floorTheRating(restaurants); 
    })
    .catch(error => {
        console.error('Error searching for restaurants:', error);
        throw error; 
    });
}

function getAllRestaurant(){
    return Restaurant
            .find()
            .select(allPageRequiredFields) 
            .lean()
            .then(restaurants => {
                floorTheRating(restaurants); 
                getCuisine(restaurants)

                restaurants.forEach(function(restaurant) {
                    restaurant["location"] = restaurant["location"].split(",")[0].trim();
                });

                return restaurants
            })
            .catch(error => {
                console.error('Error calling all  restaurants:', error);
                throw error; 
            });
}

async function addAReviewToRestaurant(restaurantId, reviewId){
    

    const restaurant = await Restaurant.findById(restaurantId)


    if (!restaurant) {
        console.log('Restaurant not found');
        return; 
    }

    await restaurant.reviews.push(reviewId);
    await restaurant.save();

    console.log('Review added to the restaurant');
}

function saveRestaurant(restaurantToSave) {
    return restaurantToSave.save()
        .then(savedRestaurant => {
            console.log('Restaurant saved successfully:', savedRestaurant);
            return savedRestaurant; 
        })
        .catch(error => {
            console.error('Error saving restaurant:', error);
            throw error;
        });
}

function addRestaurant(restaurantToSave){
    let savedRestaurant = saveRestaurant(new Restaurant(restaurantToSave))
}


function getRestoPageInfo(restaurantId){
    
}


module.exports = { searchQuery, getAllRestaurant, addAReviewToRestaurant, addRestaurant };
