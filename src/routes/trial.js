const  {sampleRestaurant, sampleProfile, sampleRestaurantReply, sampleReview} = require('./sampleData.js')


function saveSampleRestaurant(){
    sampleRestaurant.save()
    .then(savedRestaurant => {
        console.log('Sample restaurant saved successfully:', savedRestaurant);
    })
    .catch(error => {
        console.error('Error saving restaurant review:', error);
    });
}

function saveSampleProfile()
{
    sampleProfile.save()
    .then(savedProfile => {
        console.log('Sample profile saved successfully:', savedProfile);
    })
    .catch(error => {
        console.error('Error saving profile review:', error);
    });
}

function saveSampleRestaurantReply()
{
    sampleRestaurantReply.save()
    .then(savedRestaurantReply => {
        console.log('Sample restaurant reply saved successfully:', savedRestaurantReply);
    })
    .catch(error => {
        console.error('Error saving restaurant reply:', error);
    });
}

function saveSampleReview()
{
    sampleReview.save()
    .then(savedReview => {
        console.log('Sample review saved successfully:', savedReview);
    })
    .catch(error => {
        console.error('Error saving sample review:', error);
    });
}



function test(){
    saveSampleRestaurant()
    saveSampleProfile()
    saveSampleRestaurantReply()
    saveSampleReview()
}


module.exports = {test}