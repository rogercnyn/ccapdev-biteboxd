const  {sampleRestaurant, sampleProfile, sampleRestaurantReply, sampleReview} = require('./sampleData.js')


function saveSampleProfile() {
    return sampleProfile.save()
        .then(savedProfile => {
            console.log('Sample profile saved successfully:', savedProfile);
            return savedProfile; // Return the saved document
        })
        .catch(error => {
            console.error('Error saving profile review:', error);
            throw error; // Throw the error to propagate it
        });
}

function saveSampleReview() {
    return sampleReview.save()
        .then(savedReview => {
            console.log('Sample review saved successfully:', savedReview);
            // console.log('Sample review saved successfully:', savedReview.overallRating);
            return savedReview; // Return the saved document
        })
        .catch(error => {
            console.error('Error saving sample review:', error);
            throw error; // Throw the error to propagate it
        });
}

function saveSampleRestaurant() {
    return sampleRestaurant.save()
        .then(savedRestaurant => {
            console.log('Sample restaurant saved successfully:', savedRestaurant);
            return savedRestaurant; // Return the saved document
        })
        .catch(error => {
            console.error('Error saving restaurant review:', error);
            throw error; // Throw the error to propagate it
        });
}

// Repeat the same pattern for other save functions


function saveSampleRestaurantReply() {
    return sampleRestaurantReply.save()
        .then(savedRestaurantReply => {
            console.log('Sample restaurant reply saved successfully:', savedRestaurantReply);
            return savedRestaurantReply; // Return the saved document
        })
        .catch(error => {
            console.error('Error saving restaurant reply:', error);
            throw error; // Throw the error to propagate it
        });
}



function test() {
    return Promise.all([
        saveSampleRestaurant(),
        saveSampleProfile(),
        saveSampleReview(),
        saveSampleRestaurantReply()
    ]);
}

module.exports = {test}