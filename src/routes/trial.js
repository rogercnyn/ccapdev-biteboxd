const  {sampleRestaurant, sampleRatingSet} = require('./sampleData.js')


function saveSampleRestaurant(){
    sampleRestaurant.save()
    .then(savedRestaurant => {
        console.log('Sample restaurant saved successfully:', savedRestaurant);
    })
    .catch(error => {
        console.error('Error saving restaurant review:', error);
    });

}

function saveSampleRatingSet(){
    sampleRatingSet.save()
    .then(savedRatingSet => {
        console.log('Sample rating set saved successfully:', savedRatingSet);
    })
    .catch(error => {
        console.error('Error saving rating set review:', error);
    });
}

// sampleMostLovedRestaurant.save()
//     .then(savedMostLovedRestaurant => {
//         console.log('Sample loved restaurant saved successfully:', savedMostLovedRestaurant);
//     })
//     .catch(error => {
//         console.error('Error saving loved restaurant review:', error);
//     });

// sampleReview.save()
//     .then(savedReview => {
//         console.log('Sample review saved successfully:', savedReview);
//     })
//     .catch(error => {
//         console.error('Error saving sample review:', error);
//     });

// sampleProfile.save()
//     .then(savedProfile => {
//         console.log('Sample profile saved successfully:', savedProfile);
//     })
//     .catch(error => {
//         console.error('Error saving profile review:', error);
//     });



function test(){
    saveSampleRestaurant()
    // dito dapat profile
    saveSampleRatingSet()    
}


module.exports = {test}