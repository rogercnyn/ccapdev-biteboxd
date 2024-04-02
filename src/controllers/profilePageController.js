const { processReview } = require('./reviewController.js');
const { getLikedDislikedReviewsId } = require('./profileController.js');
const Profile = require('../models/Profile');

async function handleProfileRequest(req, res) {
    const requestedUsername = req.params.username;
    const requestedProfile = await Profile.findOne({ username: requestedUsername })

    if(requestedProfile === null){
        res.redirect('/');
    } else {
        if (req.session.username === requestedUsername) {
            fetchAndRenderProfile(req, res, requestedProfile, 'own-profile');
        } else {
            fetchAndRenderProfile(req, res, requestedProfile, 'others-profile');
        }
    }
    

}


async function fetchAndRenderProfile(req, res, profile, view) {
    let likedReviews = [], dislikedReviews = [];
    try {
        profileData = await Profile.findOne({ username: profile.username }).populate({
            path: 'reviews',
            populate: {
                path: 'replies'
            }
        }).populate({
            path: 'likedReviews',
            populate: {
                path: 'replies'
            }
        }).lean();

        if(req.session.loggedIn){
            reviews = await getLikedDislikedReviewsId(req.session.username)
            likedReviews = reviews[0]
            dislikedReviews = reviews[1]    
        }

        
        for (const [index, review] of profileData.reviews.entries()) {
            await processReview(review, req.session.username, req.session.loggedIn, likedReviews, dislikedReviews);
            review['order'] = index;
        }
        
        for (const [index, review] of profileData.likedReviews.entries()) {
            await processReview(review, req.session.username, req.session.loggedIn, likedReviews, dislikedReviews);
            review['order'] = index;
            // review['replies'] = [];
            console.log(review);
        }
        


        res.render(view, {
            profile: profileData,
            reviews: profileData.reviews,
            likedReviews: profileData.likedReviews,
        })
    
    } catch (error) {
        console.error(`Error fetching profile data: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { handleProfileRequest }