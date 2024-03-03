const Profile = require('../models/Profile');

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
            console.log('Profile saved successfully:', savedProfile);
            return savedProfile; 
        })
        .catch(error => {
            console.error('Error saving profile review:', error);
            throw error; 
        });
}

async function clearProfiles() {
    try {
        await Profile.deleteMany({});
        await countProfiles();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}



function addProfile(profileToSave){
    let savedProfile = saveProfile(new Profile(profileToSave))
}


module.exports = { addProfile, clearProfiles }