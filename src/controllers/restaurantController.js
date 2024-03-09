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

function searchQuery(searchTerm, sortOptions) {
    return Restaurant.find(
        {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }
            ]
        }, 
        searchRequiredFields
    )
    .sort(sortOptions) // Apply sorting options
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
    const criteria = req.query.criteria; // Get sorting criteria from query parameters

    let sortOptions = {};

    // Determine sorting options based on criteria
    if (criteria === 'recommended') {
        sortOptions = { rating: -1 }; // Sort by rating descending for recommended
    } else if (criteria === 'reviews') {
        sortOptions = { numberOfReviews: -1 }; // Sort by number of reviews descending
    } else if (criteria === 'rating') {
        sortOptions = { rating: -1 }; // Sort by rating descending
    } else if (criteria === 'price') {
        sortOptions = { startPriceRange: 1 }; // Sort by price ascending
    } else {
        // Default sorting
        sortOptions = { name: 1 }; // Sort by name ascending
    }

    try {
        const results = await searchQuery(query, sortOptions); // Pass sorting options to search function
        const resultLength = results.length; // Calculate the result length

        resp.render("search", {
            results: results,
            query: query,
            hasResults: resultLength !== 0,
            resultLength: resultLength // Pass the result length to the template
        });
    } catch (error) {
        console.error('Error searching:', error);
        resp.status(500).send('Internal Server Error');
    }
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

// Define the sortResults function outside of any other function
async function sortResults(criteria) {
    let sortedResults;
    if (criteria === 'recommended') {
        // Implement your recommended sorting logic here
        sortedResults = await Restaurant.find().sort({ recommended: -1 });
    } else if (criteria === 'reviews') {
        // Implement sorting by number of reviews logic here
        sortedResults = await Restaurant.find().sort({ numberOfReviews: -1 });
    } else if (criteria === 'rating') {
        // Implement sorting by rating logic here
        sortedResults = await Restaurant.find().sort({ rating: -1 });
    } else if (criteria === 'price') {
        // Sort by price ascending
        sortedResults = await Restaurant.find().sort({ startPriceRange: 1 });
        // Convert startPriceRange values to integers for consistent sorting
        sortedResults.forEach(restaurant => {
            restaurant.startPriceRange = parseInt(restaurant.startPriceRange);
        });
    } else {
        // Handle default sorting logic here
        sortedResults = await Restaurant.find();
    }
    return sortedResults;
}


// Define route handler for sorting
async function handleSortRequest(req, res) {
    try {
        const criteria = req.query.criteria;
        const sortedResults = await sortResults(criteria);
        console.log('Received sorting criteria:', criteria);
        // Return sorted results
        res.render('search', { results: sortedResults });
    } catch (error) {
        console.error('Error sorting results:', error);
        res.status(500).send('Internal Server Error');
    }
}

// async function handleFilterRequest(req, res) {
//     const selectedRating = req.query.rating; // Get the selected rating from the query parameters
//     const selectedCity = req.query.city; // Get the selected city from the query parameters

//     try {
//         let filteredResults = await Restaurant.find(); // Retrieve all restaurants initially

//         // Filter by selected rating
//         if (selectedRating) {
//             filteredResults = filteredResults.filter(restaurant => restaurant.rating >= selectedRating);
//         }

//         // Filter by selected city
//         if (selectedCity) {
//             filteredResults = filteredResults.filter(restaurant => restaurant.location.includes(selectedCity));
//         }

//         res.render('filteredResults', { results: filteredResults });
//     } catch (error) {
//         console.error('Error filtering results:', error);
//         res.status(500).send('Internal Server Error');
//     }
// }



module.exports = { handleSearchRequest, addBulkResto, handleGetAllRestoRequest, getRestoCardDetails, handleSortRequest, sortResults};
