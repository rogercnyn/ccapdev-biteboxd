const { getProfilePicture } = require('../controllers/profileController');
const { getRestoCardDetails } = require('./restaurantController.js');
const { getReply, populateReplies } = require('./reviewController.js');
const { readReply } = require('../controllers/restaurantreplyController.js');



function computeRating(r1, r2, r3){
    return Math.round(((r1 + r2 + r3) / 3.0) * 10, 1)/10
}

async function handleRestoPageRequest(req, resp) {
    const id = req.params._id
    let restaurant = await getRestoCardDetails(id)
    let username = req.session.username ? req.session.username : "";



    restaurant['flooredRating'] = Math.floor(restaurant['rating'])
    restaurant['xcoord'] = restaurant['coordinates'][0]
    restaurant['ycoord'] = restaurant['coordinates'][1]

    const promises = restaurant['reviews'].map(async (review) => {
        review['createdAt'] = formatDate(review['createdAt']);
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
    

    reorderReviews(restaurant['reviews'], username)
    // console.log(restaurant)
    

    resp.render("resto-reviewpage", restaurant);
}

function reorderReviews(reviews, username) {
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