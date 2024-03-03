
const Restaurant = require('../models/Restaurant.js');

function searchQuery(searchTerm) {
    return Restaurant.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { location: { $regex: searchTerm, $options: 'i' } }
        ]
    }).select('name location startPriceRange endPriceRange media rating noOfReviews description')
    .then(restaurant => {
        console.log("search result: ")
        console.log(restaurant);
    })
    .catch(error => {
        console.error('Error searching for restaurants:', error);
    });
}

module.exports = {searchQuery}