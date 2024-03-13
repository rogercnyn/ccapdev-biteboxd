const { getProfilePicture } = require('../controllers/profileController');
const { getRestoCardDetails } = require('./restaurantController.js');
const { getReply, populateReplies } = require('./reviewController.js');
const { readReply } = require('../controllers/restaurantreplyController.js');



function computeRating(r1, r2, r3){
    return Math.round(((r1 + r2 + r3) / 3.0) * 10, 1)/10
}

function filterReviews( restaurant, overallRating, affordabilityRating, foodRating, serviceRating ){
    console.log(overallRating, affordabilityRating, foodRating, serviceRating)
   
    if(overallRating){
        restaurant.reviews = restaurant.reviews.filter(review => review.overallRating >= parseInt(overallRating));
    }

    if(affordabilityRating){
        restaurant.reviews = restaurant.reviews.filter(review => review.affordabilityRating >= parseInt(affordabilityRating));
    }

    if(foodRating){
        restaurant.reviews = restaurant.reviews.filter(review => review.foodRating >= parseInt(foodRating));
    }

    if(serviceRating){
        restaurant.reviews = restaurant.reviews.filter(review => review.serviceRating >= parseInt(serviceRating));
    }

}

 function completeRestaurant(restaurant){
    restaurant['flooredRating'] = Math.floor(restaurant['rating'])
    restaurant['xcoord'] = restaurant['coordinates'][0]
    restaurant['ycoord'] = restaurant['coordinates'][1]
}

async function completeReviews(restaurant, username){
    const promises = restaurant['reviews'].map(async (review) => {
        review['createdAtDisplay'] = formatDate(review['createdAt']);
        review['longText'] = review['body'].slice(0, 230);
        review['fullText'] = review['body'].slice(230);
        review['hasNoSeeMore'] = review['fullText'].length === 0 
        review['overallRating'] = computeRating(review['affordabilityRating'],review['foodRating'], review['serviceRating'])
        review['noFood'] = 5 - review['foodRating']
        review['noService'] = 5 - review['serviceRating']
        review['noMoney'] = 5 - review['affordabilityRating']
        review['isOwnReview'] = review['username'] === username


        review['replies'].map((reply) =>{
            reply['media'] = restaurant['media']
            reply['name'] = restaurant['name']
            reply['createdAt'] = formatDate(reply['createdAt'])
        })


        const profilePicturePromise = getProfilePicture(review['username']);
        const profilePicture = await profilePicturePromise;
        return profilePicture;
    });


    const profilePictures = await Promise.all(promises);

    restaurant['reviews'].forEach((review, index) => {
        review['profilePicture'] = profilePictures[index]['image'];
        review['order'] = index
    });
}

async function handleRestoPageRequest(req, resp) {
    // parse the headers
    const id = req.params._id
    const { minStar, minPrice, minFood, minService, searchText, sorting } = req.query;
    const  restaurant = await getRestoCardDetails(id, searchText)
    const username = req.session.username ? req.session.username : "";


    completeRestaurant(restaurant)

    await completeReviews(restaurant, username)

    
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
    
    resp.render("resto-reviewpage", restaurant);
}

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

function sortStar(reviews){
    return reviews.sort((a, b) => b.overallRating - a.overallRating);
}

function sortFood(reviews){
    return reviews.sort((a, b) => b.foodRating  - a.foodRating);
}

function sortService(reviews){
    return reviews.sort((a, b) => b.serviceRating - a.serviceRating);
}

function sortAffordability(reviews){
    return reviews.sort((a, b) => b.affordabilityRating - a.affordabilityRating);
}



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




async function handleRestoResponsePageRequest(req, res) {
    const id = req.params._id;
    let restaurant = await getRestoCardDetails(id);

    if(!req.session.loggedIn){
        res.redirect('/')
    } else {
        const promises = restaurant['reviews'].map(async (review) => {
            review['createdAt'] = formatDate(review['createdAt']);
            review['longText'] = review['body'].slice(0, 230);
            review['fullText'] = review['body'].slice(230);
            review['hasNoSeeMore'] = review['fullText'].length === 0;
            review['overallRating'] = computeRating(review['affordabilityRating'], review['foodRating'], review['serviceRating']);
            review['noFood'] = 5 - review['foodRating'];
            review['noService'] = 5 - review['serviceRating'];
            review['noMoney'] = 5 - review['affordabilityRating'];
    
            review['replies'].map((reply) =>{
                reply['media'] = restaurant['media']
                reply['name'] = restaurant['name']
                reply['createdAt'] = formatDate(reply['createdAt'])
            })
    
            const profilePicturePromise = getProfilePicture(review['username']);
            const profilePicture = await profilePicturePromise;
            return profilePicture;
        });
    
        const profilePictures = await Promise.all(promises);
    
        restaurant['reviews'].forEach((review, index) => {
            review['profilePicture'] = profilePictures[index]['image'];
            review['order'] = index
        });
    
        console.log(restaurant);
        res.render("resto-responsepage", restaurant);
    }


  
}


function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-US', options);

    return `${formattedDate}`;
}


module.exports = { handleRestoPageRequest, handleRestoResponsePageRequest }