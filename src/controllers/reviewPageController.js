// Importing necessary functions and modules from respective controllers and modules
const { getLikedDislikedReviewsId } = require('../controllers/profileController');
const { getRestoCardDetails, findById, isValidRestaurant } = require('./restaurantController.js');
const { processReview } = require('./reviewController.js');
const Restaurant = require('../models/Restaurant.js');
const Profile = require('../models/Profile.js');

// Function to filter reviews based on different criteria
function filterReviews( restaurant, overallRating, affordabilityRating, foodRating, serviceRating ){
    // console.log(overallRating, affordabilityRating, foodRating, serviceRating)
   
    // Filtering reviews based on overall, affordability, food, and service ratings if provided
    if(overallRating && overallRating !== "0"){
        restaurant.reviews = restaurant.reviews.filter(review => Math.floor(review.overallRating) === parseInt(overallRating));
    }

    if(affordabilityRating && affordabilityRating !== "0"){
        restaurant.reviews = restaurant.reviews.filter(review => Math.floor(review.affordabilityRating) === parseInt(affordabilityRating));
    }

    if(foodRating && foodRating !== "0"){
        restaurant.reviews = restaurant.reviews.filter(review => Math.floor(review.foodRating) === parseInt(foodRating));
    }

    if(serviceRating && serviceRating !== "0"){
        restaurant.reviews = restaurant.reviews.filter(review => Math.floor(review.serviceRating) === parseInt(serviceRating));
    }

}

// Function to add computed properties to a restaurant object
 function completeRestaurant(restaurant){
    restaurant['flooredRating'] = Math.floor(restaurant['rating'])
    restaurant['stars'] = Math.floor(restaurant['rating'])
    restaurant['xcoord'] = restaurant['coordinates'][0]
    restaurant['ycoord'] = restaurant['coordinates'][1]
}



// Function to complete reviews by adding additional properties and profile pictures
async function completeReviews(restaurant, username, loggedIn, isResto = false){
    
    let likedReviews = [], dislikedReviews = [];
    
    // Fetching liked and disliked reviews if user is logged in
    // so we know which reviews should have a colored like or dislike
    if(loggedIn && !isResto){
        reviews = await getLikedDislikedReviewsId(username)
        likedReviews = reviews[0]
        dislikedReviews = reviews[1]
    }
    

    restaurant['reviews'].map(async (review, index) => {
        let restaurants = await Restaurant.findOne({ reviews: review['_id'] })
        let profile = await Profile.findOne({ username: review['username'] })

        await processReview(review, username, loggedIn, likedReviews, dislikedReviews, isResto);
        review['profilePicture'] = profile['image']
        console.log("added profile picture inside review: ", review['profilePicture']);

        review['order'] = index    
        review['isResto'] = isResto


        review['replies'].forEach((reply) => {
            reply['name'] = restaurants['name'];
            reply['media'] = restaurant['media']
        });
    });


}



// Request handler for rendering the restaurant review page
async function handleRestoPageRequest(req, resp) {
    const id = req.params._id
    const isValid = await isValidRestaurant(id)

    if(isValid) {
        // Extracting query parameters from the request
        const { minStar, minPrice, minFood, minService, searchText, sorting } = req.query;
        // Retrieving restaurant details
        const  restaurant = await getRestoCardDetails(id, searchText)
        const username = req.session.username ? req.session.username : "";
    
        // Completing restaurant details
        completeRestaurant(restaurant)
    
        // Filtering reviews based on provided criteria
        await completeReviews(restaurant, username, resp.locals.loggedIn)
    
        
        filterReviews(restaurant, minStar, minPrice, minFood, minService)
    
    
        // Sorting reviews based on sorting criteria
        // assuming recommended & tie breaker 
        sortRecommended(restaurant['reviews'], username)
        
        if(sorting && sorting.startsWith("recent")) {
            sortRecent(restaurant['reviews'], "recentM" === sorting)
        } else if (sorting === "rating") {
            sortStar(restaurant['reviews'])
        } else if (sorting === "food-quality") {
            sortFood(restaurant['reviews']) 
        } else if (sorting === "service") {
            sortService(restaurant['reviews'])
        } else if (sorting === "affordability") {
            sortAffordability(restaurant['reviews'])
        }

        console.log("START OF RESTO ======")
        console.log(restaurant)
        console.log("END OF RESTO ======")
        
        // Rendering the restaurant review page with the processed data
        resp.render("resto-reviewpage", restaurant);
    } else {
        resp.redirect("/")
    }
   
}

// Function to sort reviews based on most recent or least recent
function sortRecent(reviews, mostRecent){
    return reviews.sort((a, b) => {
        if (mostRecent) {
            // Sort from most recent to least recent
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            // Sort from least recent to most recent
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });
}

// Functions to sort reviews based on different criteria
const sortStar = (reviews) => reviews.sort((a, b) => b.overallRating - a.overallRating);
const sortFood = (reviews) => reviews.sort((a, b) => b.foodRating  - a.foodRating);
const sortService = (reviews) => reviews.sort((a, b) => b.serviceRating - a.serviceRating);
const sortAffordability = (reviews) => reviews.sort((a, b) => b.affordabilityRating - a.affordabilityRating);


// Function to sort reviews based on recommended criteria
function sortRecommended(reviews, username) {
    return reviews.sort((a, b) => {
        if (a.username === username) {
            return -1;
        }
        if (b.username === username) {
            return 1;
        }
        return (b.noOfLikes - b.noOfDislikes) - (a.noOfLikes - a.noOfDislikes);
    });
}



// Request handler for rendering the response page for restaurant reviews
async function handleRestoResponsePageRequest(req, res) {
    const id = req.params._id;
    const findResto = await findById(id);

    if (findResto) {
        const { minStar, minPrice, minFood, minService, searchText, sorting } = req.query;
        let restaurant = await getRestoCardDetails(id, searchText);
        const username = req.session.username ? req.session.username : "";


        if(!req.session.loggedIn){
            res.redirect('/')
        } else {
            completeRestaurant(restaurant)

            await completeReviews(restaurant, username, true, true)

            
            filterReviews(restaurant, minStar, minPrice, minFood, minService)


            // assuming recommended & tie breaker 
            sortRecommended(restaurant['reviews'], username)
            
            if(sorting && sorting.startsWith("recent")) {
                sortRecent(restaurant['reviews'], "recentM" === sorting)
            } else if (sorting === "rating") {
                sortStar(restaurant['reviews'])
            } else if (sorting === "food-quality") {
                sortFood(restaurant['reviews']) 
            } else if (sorting === "service") {
                sortService(restaurant['reviews'])
            } else if (sorting === "affordability") {
                sortAffordability(restaurant['reviews'])
            }
        
            res.render("resto-responsepage", restaurant);
        }
    }

    else {
        res.redirect("/");
    }
  
}




// Exporting functions 
module.exports = { handleRestoPageRequest, handleRestoResponsePageRequest }