const Restaurant = require('../models/Restaurant.js');

function searchQuery(searchTerm) {
    return Restaurant.find(
        {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } }
            ]
        }, 
        { _id: 0, name: 1, location: 1, startPriceRange: 1, endPriceRange: 1, media: 1, rating: 1, noOfReviews: 1, description: 1 }
    )
    .lean() 
    .then(restaurants => {
        restaurants.forEach(restaurant => {
            restaurant.rating = Math.floor(restaurant.rating);
        });
        return restaurants; 
    })
    .catch(error => {
        console.error('Error searching for restaurants:', error);
        throw error; 
    });
}

module.exports = { searchQuery };
