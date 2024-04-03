const Profile = require('../models/Profile');
const Review = require('../models/Review'); 
const bcrypt = require('bcryptjs');




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
        updateUsersStats();
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
    return await Profile.findOne({"username": username})['image']
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

}



function addProfile(profileToSave){
    let savedProfile = saveProfile(new Profile(profileToSave))
    addReviewToProfile(savedProfile['_id'])
}

async function addBulkProfile(parsedJson) {
    try {
        await clearProfiles(); 
        console.log("Clearing existing profiles and preparing to insert new profiles...");
        const hashedProfiles = await Promise.all(parsedJson.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        }));

        await Profile.insertMany(hashedProfiles);
        
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

async function createUser(req, res){
    try {
        const { firstName, lastName, username, email, password, tasteProfile } = req.body;
        const parsedTasteProfile = JSON.parse(tasteProfile);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        let imagePath = req.file ? req.file.filename : req.body.image || 'default-avatar.png';
        
        const newUser = new Profile({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            tasteProfile: parsedTasteProfile,
            image: imagePath,
            bgImage: 'header.jpg',
            hearts: 0,
            dislike: 0,
            credibility: 0
        });
        
        await newUser.save();
        
        console.log("User created successfully:", newUser);
        
        res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function editProfile(req, res) {
    const userId = req.session.userId;
    const username = req.session.username;
    const { firstName, lastName, profileBio } = req.body;

    try {
        let profileUpdate = {
            firstName: firstName,
            lastName: lastName,
            bio: profileBio
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
}

// async function changeUserPassword(req, res) {
//     const { username } = req.params;
//     const { oldPassword, newPassword } = req.body;
//     try {
//         const user = await Profile.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Incorrect current password' });
//         }


//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         user.password = hashedPassword; 
//         await user.save();

//         res.json({ success: true, message: 'Password successfully changed' });
//     } catch (error) {
//         console.error('Error changing password:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

async function changeUserPassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.username; // Assuming username is stored in session

    try {
        const user = await Profile.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password successfully changed' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateUsersStats() {
    try {
        const profiles = await Profile.find();
        // console.log(`Found ${profiles.length} profiles to update.`);
        
        for (let profile of profiles) {
            const aggregation = await Review.aggregate([
                { $match: { username: profile.username } },
                { $group: {
                    _id: '$username',
                    totalHearts: { $sum: '$noOfLikes' },
                    totalDislikes: { $sum: '$noOfDislikes' }
                }}
            ]);
            // console.log(`Aggregation result for ${profile.username}:`, aggregation);
            
            if (aggregation.length > 0) {
                const { totalHearts, totalDislikes } = aggregation[0];
                let credibility = 0;
                
                if (totalHearts + totalDislikes > 0) {
                    credibility = (totalHearts / (totalHearts + totalDislikes)) * 100;
                }
                
                const updatedProfile = await Profile.findOneAndUpdate(
                    { _id: profile._id },
                    {
                        $set: {
                            hearts: totalHearts,
                            dislike: totalDislikes,
                            credibility: credibility
                        }
                    },
                    { new: true }
                );

                // console.log(`Updated profile for ${profile.username}:`, updatedProfile);
            console.log(`Updated stats for ${profile.username}:`, { totalHearts, totalDislikes, credibility });

            }
        }

        console.log('Updated stats for all users');
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

async function updateTasteProfile(req, res) {
    const { username } = req.session;
    const { newTasteProfile } = req.body;

    try {
        await updateProfileByUsername(username, { tasteProfile: newTasteProfile });
        res.json({ success: true, message: 'Taste profile updated successfully' });
    } catch (error) {
        console.error('Error updating taste profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getTasteProfile(req, res){
    const username = req.session.username; 
    try {
        const profile = await findProfileByUsername(username);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ tasteProfile: profile.tasteProfile });
    } catch (error) {
        console.error('Error fetching taste profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

updateUsersStats();

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
    getLikedDislikedReviewsId,
    modifyLikeDislikeReview, 
    changeUserPassword,
    getTasteProfile,
    updateTasteProfile
};