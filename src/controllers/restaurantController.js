const Restaurant = require('../models/Restaurant.js');
const searchRequiredFields = { _id: 1, name: 1, location: 1, startPriceRange: 1, endPriceRange: 1, media: 1, rating: 1, numberOfReviews: 1, description: 1 }
const allPageRequiredFields = { _id: 1, name: 1, location: 1,  media: 1, rating: 1, shortDescription: 1, tag: 1 }

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


async function getRestoCardDetails(id){
    return await Restaurant.findById(id).select("-password").populate('reviews').lean()
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


async function countRestaurants() {
    try {
        const count = await Restaurant.countDocuments();
        console.log(`Number of documents in the Restaurant collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}


async function clearRestaurants() {
    try {
        await Restaurant.deleteMany({});
        await countRestaurants();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}


function addRestaurant(restaurantToSave){
    let savedRestaurant = saveRestaurant(new Restaurant(restaurantToSave))
}



function getRestoPageInfo(restaurantId){
    
}

async function addBulkResto(parsedJson){
    try {
        await clearRestaurants(); 
        console.log("Inserting restaurants...")
        await Restaurant.insertMany(parsedJson)
        await countRestaurants()
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

async function handleSearchRequest(req, resp) {
    const query = req.query.query;
    
    searchQuery(query)
        .then(results => {
            console.log(query);
            const resultLength = results.length; // Calculate the result length
            resp.render("search", {
                results: results,
                query: query,
                hasResults: resultLength !== 0,
                resultLength: resultLength // Pass the result length to the template
            }); 
        })
        .catch(error => {
            console.error('Error searching:', error);
            resp.status(500).send('Internal Server Error');
        });
}


async function handleGetAllRestoRequest(req, resp){
    getAllRestaurant()
        .then
        (
            results => {
                console.log(results)
                resp.render("all", 
                {
                    results: results    
                })
            }   
        )
}



module.exports = { handleSearchRequest, addBulkResto, handleGetAllRestoRequest, getRestoCardDetails };
