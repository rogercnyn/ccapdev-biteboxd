const Profile = require('../models/Profile');

const Review = require('../models/Review');


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

        // console.log('Profile found:', profile);
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
        const { firstName, lastName, bio } = req.body;
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
    
            res.redirect("/own-profile");
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
    let requestedProfile = req.params.username;
    if(req.session.username === requestedProfile) {
        
        handleOwnProfile(req, res)
    } else {
        // how to handle other profile
    }
    
}

async function handleOwnProfile(req, res) {
    try {
        const profile = await Profile.findById(req.session.userId)
                                     .populate('reviews') 
                                     .populate('likedReviews')   
                                     .exec();

        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        const profileData = profile.toObject({ virtuals: true });

        console.log(profileData);

        res.render('own-profile', { 
            profile: profileData,
            reviews: profileData.reviews,
            likedReviews: profileData.likedReviews
        });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).send('Internal Server Error');
    }
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
    handleProfileRequest
};