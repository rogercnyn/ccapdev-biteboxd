const Profile = require('../models/Profile');

const Review = require('../models/Review');



async function getLikedDislikedReviewsId(username) {
    try {
        const profile = await Profile.findOne({ username: username }).lean();
        let likedReviews = profile.likedReviews;
        let dislikedReviews = profile.dislikedReviews;
        let stringify = (reviews) => reviews.map(review => review.toString());
        
        return [stringify(likedReviews), stringify(dislikedReviews)];
    } catch (error) {
        console.log('Error getting liked reviews');
    }
}

async function modifyLikeDislikeReview(username, reviewId, like, dislike) {
    try {
        const profile = await Profile.findOne({ username: username });

        if(like == 1){
            profile.likedReviews.push(reviewId);
        } else if (like == -1) {
            profile.likedReviews = profile.likedReviews.filter(id => id.toString() !== reviewId);
        }

        if(dislike == 1) {
            profile.dislikedReviews.push(reviewId);
        } else if (dislike == -1) {
            profile.dislikedReviews = profile.dislikedReviews.filter(id => id.toString() !== reviewId);
        }

        await profile.save();
    } catch (error) {
        console.error('Error modifying profile like:', error);
    }
}


async function countProfiles() {
    try {
        const count = await Profile.countDocuments();
        console.log(`Number of documents in the Profile collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}

function saveProfile(profileToSave) {
    return profileToSave.save()
        .then(savedProfile => {
            // console.log('Profile saved successfully:', savedProfile);
            return savedProfile; 
        })
        .catch(error => {
            console.error('Error saving profile review:', error);
            throw error; 
        });
}


async function getProfilePicture(username){
    return await Profile.findOne({"username": username}).select("image").exec()
}

async function clearProfiles() {
    try {
        await Profile.deleteMany({});
        await countProfiles();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}

async function findProfileByUsername(username) {
    try {
        const profile = await Profile.findOne({ username });
        
        if (!profile) {
            console.log('Profile not found');
            return null;
        }
        return profile;
    } catch (error) {
        console.error('Error finding profile:', error);
        throw error;
    }
}

async function addReviewToProfile(username, reviewId){
    

    let profile = await findProfileByUsername(username)

    if(!profile){
        console.log(username + ' not found')
        return;
    }

    await profile.reviews.push(reviewId);
    await profile.save();

    // console.log('Review added to ' + username );
}



function addProfile(profileToSave){
    let savedProfile = saveProfile(new Profile(profileToSave))
    addReviewToProfile(savedProfile['_id'])
}

async function addBulkProfile(parsedJson){
    try {
        await clearProfiles(); 
        console.log("Inserting profiles...")
        await Profile.insertMany(parsedJson)
        await countProfiles();
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}

async function createProfile(profileData) {
    try {
        const newProfile = new Profile(profileData);
        await newProfile.save();
        return newProfile;
    } catch (error) {
        throw error;
    }
}

async function findProfileByUsername(username) {
    try {
        const profile = await Profile.findOne({ username: username });
        return profile;
    } catch (error) {
        throw error;
    }
}


async function updateProfileByUsername(username, profileUpdates) {
    try {
        const updatedProfile = await Profile.findOneAndUpdate({ username: username }, profileUpdates, { new: true });
        return updatedProfile;
    } catch (error) {
        throw error;
    }
}

async function getProfileById(id) {
    try {
        const profile = await Profile.findById(id);
        return profile;
    } catch (error) {
        throw error;
    }
}


async function createUser(req, res) {
    try {
        const { firstName, lastName, username, email, password, tasteProfile } = req.body;
        if (!tasteProfile) {
            return res.status(400).send("Taste profiles string is empty or null");
        }

        const tasteProfilesArray = JSON.parse(tasteProfile);
        const avatarFilename = req.file ? req.file.filename : 'default-avatar.png';
        const headerFilename = 'header.jpg';

        const newProfile = new Profile({
            firstName,
            lastName,
            username,
            email,
            password,
            tasteProfile: tasteProfilesArray,
            image: avatarFilename,
            bgImage: headerFilename,
            hearts: 0,
            dislike: 0,
            credibility: 0
        });

        await newProfile.save();
        res.redirect('/login'); 
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error during signup');
    }
};

async function editProfile(req,res) {
    const userId = req.session.userId;
    const username = req.session.username;
        const {  firstName, lastName, bio } = req.body;
        try {
            let profileUpdate = {
                firstName: firstName,
                lastName: lastName,
                bio: bio
            };
            if (req.file) {
                profileUpdate.image = req.file.filename;
                req.session.profilePicture = profileUpdate.image; 
            }
            const updatedProfile = await Profile.findByIdAndUpdate(userId, profileUpdate, { new: true });
    
            res.redirect(`/profile/${username}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send("Internal Server Error");
        }
};

async function deleteReview(req,res) {
    const { reviewId } = req.body; 

    if (!reviewId) {
        return res.status(400).json({ message: 'Review ID not provided' });
    }

    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        await Profile.updateMany(
            { reviews: reviewId },
            { $pull: { reviews: reviewId } }
        );

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};


async function updateReview(req,res) {
    const { reviewId, editTitle, editBody, editFoodRating, editServiceRating, editAffordabilityRating } = req.body;

    console.log("Updating review ID: ", reviewId);
    console.log("Received data: ", req.body);

    try {
        const update = {
            title: editTitle,
            body: editBody,
            foodRating: editFoodRating,
            serviceRating: editServiceRating,
            affordabilityRating: editAffordabilityRating,
        };

        console.log("Update object: ", update);

        const updatedReview = await Review.findByIdAndUpdate(reviewId, update, { new: true });
        if (!updatedReview) {
            console.log("Review not found or update failed");
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        console.log("Updated review: ", updatedReview);
        res.json({ success: true, message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};



async function handleProfileRequest(req, res) {
    const requestedUsername = req.params.username;
    if (req.session.username === requestedUsername) {
        //eto for own profile
        fetchAndRenderProfile({ _id: req.session.userId }, res, 'own-profile');
    } else {
        //dis wan for others
        fetchAndRenderProfile({ username: requestedUsername }, res, 'others-profile');
    }
}

// async function fetchAndRenderProfile(query, res, view) {
//     try {
//         let profileQuery = Profile.findOne(query);
//         if (query._id) {
//             profileQuery = Profile.findById(query._id);
//         }

//         const profile = await profileQuery.populate('reviews').populate('likedReviews').exec();
//         if (!profile) {
//             return res.status(404).send('Profile not found');
//         }

//         const profileData = profile.toObject({ virtuals: true });

//         // const promises = profileData.likedReviews.map(async (review) => {
//         //     review['createdAtDisplay'] = formatDate(review['createdAt']);
//         //     review['longText'] = review['body'].slice(0, 230);
//         //     review['fullText'] = review['body'].slice(230);
//         //     review['hasNoSeeMore'] = review['fullText'].length === 0;
//         //     review['overallRating'] = computeRating(review['affordabilityRating'], review['foodRating'], review['serviceRating']);
//         //     review['noFood'] = 5 - review['foodRating'];
//         //     review['noService'] = 5 - review['serviceRating'];
//         //     review['noMoney'] = 5 - review['affordabilityRating'];
//         //     review['isOwnReview'] = review['username'] === username;

//         //     review['replies'].map((reply) => {
//         //         reply['media'] = profileData['media'];
//         //         reply['name'] = profileData['name'];
//         //         reply['createdAt'] = formatDate(reply['createdAt']);
//         //     });

//         //     const profilePicturePromise = getProfilePicture(review['username']);
//         //     const profilePicture = await profilePicturePromise;

//         //     return profilePicture;
//         // });

//         res.render(view, {
//             profile: profileData,
//             reviews: profileData.reviews,
//             likedReviews: profileData.likedReviews,
//         });
//     } catch (error) {
//         console.error(`Error fetching profile data: ${error}`);
//         res.status(500).send('Internal Server Error');
//     }
// }
async function fetchAndRenderProfile(query, res, view) {
    try {
        let profileQuery = Profile.findOne(query);
        if (query._id) {
            profileQuery = Profile.findById(query._id);
        }

        const profile = await profileQuery.populate('reviews').populate('likedReviews').exec();
        if (!profile) {
            res.redirect('/');
        } else {

        const profileData = profile.toObject({ virtuals: true });

        const likedReviewsProfilePictures = await Promise.all(profileData.likedReviews.map(async (review) => {
            try {
                const userProfile = await Profile.findOne({ username: review.username });
                if (userProfile && userProfile.image) {
                    return userProfile.image;
                } else {
                    console.error('Profile image not found for a review:', review._id);
                    return null;
                }
            } catch (error) {
                console.error('Error finding profile for a review:', error);
                return null;
            }
        }));


        // profileData.reviews.forEach((review, index) => {
        //     review['longText'] = review['body'].slice(0, 230);
        //     review['fullText'] = review['body'].slice(230);
        //     review['hasNoSeeMore'] = review['fullText'].length === 0;
        // });
        res.render(view, {
            profile: profileData,
            reviews: profileData.reviews,
            likedReviews: profileData.likedReviews,
            likedReviewsProfilePictures: likedReviewsProfilePictures
        });
    }
    } catch (error) {
        console.error(`Error fetching profile data: ${error}`);
        res.status(500).send('Internal Server Error');
    }
}




function computeRating(r1, r2, r3){
    return Math.round(((r1 + r2 + r3) / 3.0) * 10, 1)/10
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










module.exports = { 
    saveProfile, 
    clearProfiles, 
    findProfileByUsername, 
    addReviewToProfile, 
    addBulkProfile,
    updateProfileByUsername,
    getProfileById,
    getProfilePicture,
    createUser,
    editProfile,
    deleteReview,
    updateReview,
    handleProfileRequest,
    getLikedDislikedReviewsId,
    modifyLikeDislikeReview
};