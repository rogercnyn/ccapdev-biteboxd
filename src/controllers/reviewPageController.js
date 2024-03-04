const { getRestoCardDetails } = require('./restaurantController.js');

const Review = require('../models/Review.js');
const Profile = require('../models/Profile.js');

async function getProfilePicture(username){
    // console.log(Profile.find({"username": username}))
    return await Profile.findOne({"username": username}).select("image").exec()
}

async function handleRestoPageRequest(req, resp) {
    const id = req.params._id
    let restaurant = await getRestoCardDetails(id)

    const promises = restaurant['reviews'].map(async (review) => {
        review['createdAt'] = formatDate(review['createdAt']);
        const profilePicturePromise = getProfilePicture(review['username']);
        const profilePicture = await profilePicturePromise;
        return profilePicture;
    });

    const profilePictures = await Promise.all(promises);

    restaurant['reviews'].forEach((review, index) => {
        review['profilePicture'] = profilePictures[index]['image'];
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