const { processReview } = require('./reviewController.js');
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
    try {
       
        
        profileData = await Profile.findOne({ username: profile.username }).populate({
            path: 'reviews',
            populate: {
                path: 'replies'
            }
        }).populate('likedReviews').lean();
       
        profileData.reviews.forEach((review, index) => {
            processReview(review, req.session.username, req.session.loggedIn);
            review['order'] = index
            review['profilePicture'] = profileData.image;
            review['replies'].forEach((reply) => {
                // reply['media'] = "";
                reply['name'] = "nest to find the resto";
            })
            // console.log(review)
            // console.log(req.session.profilePic)
        })

            // const likedReviewsProfilePictures = await Promise.all(profileData.likedReviews.map(async (review) => {
            //     try {
            //         const userProfile = await Profile.findOne({ username: review.username });
            //         if (userProfile && userProfile.image) {
            //             return userProfile.image;
            //         } else {
            //             console.error('Profile image not found for a review:', review._id);
            //             return null;
            //         }
            //     } catch (error) {
            //         console.error('Error finding profile for a review:', error);
            //         return null;
            //     }
            //     }));


        // profileData.reviews.forEach((review, index) => {
        //     review['longText'] = review['body'].slice(0, 230);
        //     review['fullText'] = review['body'].slice(230);
        //     review['hasNoSeeMore'] = review['fullText'].length === 0;
        // });

        res.render(view, {
            profile: profileData,
            reviews: profileData.reviews,
        })
        // res.render(view, {
        //     profile: profileData,
        //     reviews: profileData.reviews,
        //     likedReviews: profileData.likedReviews,
        //     likedReviewsProfilePictures: likedReviewsProfilePictures
        // });
    
    } catch (error) {
        console.error(`Error fetching profile data: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { handleProfileRequest }