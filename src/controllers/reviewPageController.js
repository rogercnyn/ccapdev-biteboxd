const { getRestoCardDetails } = require('./restaurantController.js');

const Profile = require('../models/Profile.js');

async function getProfilePicture(username){
    return await Profile.findOne({"username": username}).select("image").exec()
}

function computeRating(r1, r2, r3){
    return Math.round(((r1 + r2 + r3) / 3.0) * 10, 1)/10
}

async function handleRestoPageRequest(req, resp) {
    const id = req.params._id
    let restaurant = await getRestoCardDetails(id)

    const promises = restaurant['reviews'].map(async (review) => {
        review['createdAt'] = formatDate(review['createdAt']);
        review['longText'] = review['body'].slice(0, 255);
        review['fullText'] = review['body'].slice(255);
        review['hasNoSeeMore'] = review['fullText'].length === 0 
        review['overallRating'] = computeRating(review['affordabilityRating'],review['foodRating'], review['serviceRating'])
        review['noFood'] = 5 - review['foodRating']
        review['noService'] = 5 - review['serviceRating']
        review['noMoney'] = 5 - review['affordabilityRating']
        const profilePicturePromise = getProfilePicture(review['username']);
        const profilePicture = await profilePicturePromise;
        return profilePicture;
    });

    const profilePictures = await Promise.all(promises);

    restaurant['reviews'].forEach((review, index) => {
        review['profilePicture'] = profilePictures[index]['image'];
        review['order'] = index
    });

    console.log(restaurant['reviews'])
    resp.render("resto-reviewpage", restaurant);
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


module.exports = { handleRestoPageRequest }