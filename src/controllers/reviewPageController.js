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
    // restaurant = await populateReplies(restaurant)
  
    console.log('HERE')

    const promises = restaurant['reviews'].map(async (review) => {
        review['createdAt'] = formatDate(review['createdAt']);
        review['longText'] = review['body'].slice(0, 255);
        review['fullText'] = review['body'].slice(255);
        review['hasNoSeeMore'] = review['fullText'].length === 0 
        review['overallRating'] = computeRating(review['affordabilityRating'],review['foodRating'], review['serviceRating'])
        review['noFood'] = 5 - review['foodRating']
        review['noService'] = 5 - review['serviceRating']
        review['noMoney'] = 5 - review['affordabilityRating']

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

    resp.render("resto-reviewpage", restaurant);
}

async function handleRestoResponsePageRequest(req, resp) {
    const id = req.params._id;
    let restaurant = await getRestoCardDetails(id);

    const promises = restaurant['reviews'].map(async (review) => {
        review['createdAt'] = formatDate(review['createdAt']);
        review['longText'] = review['body'].slice(0, 255);
        review['fullText'] = review['body'].slice(255);
        review['hasNoSeeMore'] = review['fullText'].length === 0;
        review['overallRating'] = computeRating(review['affordabilityRating'], review['foodRating'], review['serviceRating']);
        review['noFood'] = 5 - review['foodRating'];
        review['noService'] = 5 - review['serviceRating'];
        review['noMoney'] = 5 - review['affordabilityRating'];
        review['hasReplies'] = review['replies'].length > 0;

        const profilePicturePromise = getProfilePicture(review['username']);
        const profilePicture = await profilePicturePromise;
        return profilePicture;
    });

    const profilePictures = await Promise.all(promises);

    const updatedReviews = await Promise.all(restaurant['reviews'].map(async (review, index) => {
        review['profilePicture'] = profilePictures[index]['image'];
        review['order'] = index;

        if (review['hasReplies']) {
            const replyPromises = review['replies'].map(async (replyId) => {
                const reply = await getReply(replyId);
                console.log(replyId);
                return reply;
            });

            const replies = await Promise.all(replyPromises);
            review['repliesDetails'] = replies;

        }
            return review; 
        }));
        
        restaurant['reviews'] = updatedReviews;  

    console.log(restaurant);
    resp.render("resto-responsepage", restaurant);
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