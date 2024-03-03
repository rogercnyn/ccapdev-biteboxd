
const Restaurant = require('./models/Restaurant'); // Assuming you have a Restaurant model defined

// Assuming you already have an established MongoDB connection named `dbConnection`

// Search for a restaurant by name or location (case-insensitive)
const searchTerm = "Jollibee"; // Example search term (can be provided dynamically)

func searchQuery(searchTerm) {
    Restaurant.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { location: { $regex: searchTerm, $options: 'i' } }
        ]
    })
    .then(restaurants => {
        console.log('Search Results:', restaurants);
    })
    .catch(error => {
        console.error('Error searching for restaurants:', error);
    });
}