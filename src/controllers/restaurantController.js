const Restaurant = require('../models/Restaurant.js');
const searchRequiredFields = { _id: 1, name: 1, location: 1, startPriceRange: 1, endPriceRange: 1, media: 1, rating: 1, numberOfReviews: 1, description: 1, numberOfCash: 1}
const allPageRequiredFields = { _id: 1, name: 1, location: 1,  media: 1, rating: 1, shortDescription: 1, tag: 1 }
const mongoose = require('mongoose')
function floorTheRating(restaurants){
    restaurants.forEach(restaurant => {
        restaurant.stars = Math.floor(restaurant.rating)
        restaurant.noStars = 5-restaurant.stars
    });
    return restaurants
}

function getCuisine(restaurants){
    restaurants.forEach(restaurant => {
        restaurant.tag = restaurant.tag[0].substring(0, 3).toLowerCase()
    })
}

async function searchQuery(searchTerm, locationInput) {
    let query =  await Restaurant.find(
        {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        }, 
        searchRequiredFields
    )
    .lean() 

    
    query = floorTheRating(query);

    if(locationInput) {
        const regex = new RegExp(locationInput, 'i');
        query = query.filter(resto => regex.test(resto.location));
    }

    return query
}




async function getRestoCardDetails(id, searchText) {
    let query = await Restaurant.findById(id)
        .select("-password")
        .populate({
            path: 'reviews',
            populate: {
                path: 'replies'
            }
        })
        .lean();
 
  
    if (searchText) {
        const regex = new RegExp(searchText, 'i');
        query.reviews = query.reviews.filter(review => regex.test(review.body));
    }
    
    return query
}  

async function isValidRestaurant(id){
    try {
        // Check if the provided id can be cast to ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }

        const result = await Restaurant.exists({ _id: id });
        return result;
    } catch (err) {
        console.error(err);
        return false; // Or handle the error as per your requirement
    }
}




function getAllRestaurant(){
    return Restaurant
            .find()
            .select(allPageRequiredFields) 
            .lean()
            .then(restaurants => {
                floorTheRating(restaurants); 
                getCuisine(restaurants)

                restaurants.forEach(function(restaurant) {
                    restaurant["location"] = restaurant["location"].split(",")[0].trim();
                });

                return restaurants
            })
            .catch(error => {
                console.error('Error calling all  restaurants:', error);
                throw error; 
            });
}

async function addAReviewToRestaurant(restaurantId, reviewId){

    const restaurant = await Restaurant.findById(restaurantId)
    

    if (!restaurant) {
        console.log('Restaurant not found');
        return; 
    }

    await restaurant.reviews.push(reviewId);
    await restaurant.save();

    console.log('Review added to the restaurant');
}

function saveRestaurant(restaurantToSave) {
    return restaurantToSave.save()
        .then(savedRestaurant => {
            console.log('Restaurant saved successfully:', savedRestaurant);
            return savedRestaurant; 
        })
        .catch(error => {
            console.error('Error saving restaurant:', error);
            throw error;
        });
}


async function countRestaurants() {
    try {
        const count = await Restaurant.countDocuments();
        console.log(`Number of documents in the Restaurant collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}


async function clearRestaurants() {
    try {
        await Restaurant.deleteMany({});
        await countRestaurants();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}


function addRestaurant(restaurantToSave){
    let savedRestaurant = saveRestaurant(new Restaurant(restaurantToSave))
}



function getRestoPageInfo(restaurantId){
    
}

async function addBulkResto(parsedJson){
    try {
        await clearRestaurants(); 
        console.log("Inserting restaurants...")
        await Restaurant.insertMany(parsedJson)
        await countRestaurants()
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}


function filterRestaurants( restaurants, minStar, minRev, minPrice, maxPrice){

    if(minStar){
        restaurants = restaurants.filter(restaurant => restaurant.rating >= parseInt(minStar));
    }

    if(minRev){
        restaurants = restaurants.filter(restaurant => restaurant.numberOfReviews >= parseInt(minRev));
    }

    if(minPrice){
        restaurants = restaurants.filter(restaurant => restaurant.startPriceRange >= parseInt(minPrice));
    }

    if(maxPrice){
        restaurants = restaurants.filter(restaurant => restaurant.endPriceRange <= parseInt(maxPrice));
    }

    return restaurants

}

const sortRecommended = restaurants => restaurants.sort((a, b) => b.rating - a.rating);
const sortReviewersLH = restaurants => restaurants.sort((a, b) => a.numberOfReviews - b.numberOfReviews);
const sortReviewersHL = restaurants => restaurants.sort((a, b) => b.numberOfReviews - a.numberOfReviews);
const sortPriceLH = restaurants => restaurants.sort((a, b) => a.startPriceRange - b.startPriceRange);
const sortPriceHL = restaurants => restaurants.sort((a, b) => b.startPriceRange - a.startPriceRange);

const sortByNameAsc = restaurants => restaurants.slice().sort((a, b) => a.name.localeCompare(b.name));

async function handleSearchRequest(req, resp) {
    // console.log("HERE")
    const { query, minStar, locationInput, minRev, minPrice, maxPrice, sorting } = req.query;

    
    let restaurants = await searchQuery(query, locationInput)
    restaurants = filterRestaurants(restaurants, minStar, minRev, minPrice, maxPrice)
    const resultLength = restaurants.length; 

    sortRecommended(restaurants)

    if (sorting === "reviewsHL"){
        sortReviewersHL(restaurants)
    } else if (sorting === "reviewsLH"){
        sortReviewersLH(restaurants)
    } else if (sorting === "priceLH"){
        sortPriceLH(restaurants)
    } else if (sorting === "priceHL"){
        sortPriceHL(restaurants)
    }

    resp.render("search", {
        results: restaurants,
        query: query,
        hasResults: resultLength !== 0,
        resultLength: resultLength 
    }); 

    
}

async function handleGetAllRestoRequest(req, resp){

    const { sorting } = req.query;

    getAllRestaurant()
        .then
        (
            results => {

                if (sorting === "ratingLH"){
                    results = sortRecommended(results).slice().reverse()
                } else if (sorting === "rating"){
                    sortRecommended(results)
                } else if (sorting === "az"){
                    sortByNameAsc(results)
                } else if (sorting === "za"){
                    results = sortByNameAsc(results).slice().reverse()
                }
            

                resp.render("all", 
                {
                    results: results    
                })
            }   
        )
}

async function handleExploreRequest(req, res){
    let restaurants = await Restaurant.find().select("-password").lean();

    restaurants = floorTheRating(restaurants);

    sortReviewersHL(restaurants)
    console.log(restaurants)
    let topRestaurants = restaurants.slice(0, 5)
    let editorsChoice =  restaurants.filter(restaurant => restaurant.rating == 5).slice(0, 5);


    const regex = new RegExp("Taft", 'i');
    let popularAroundYou = restaurants.filter(resto => regex.test(resto.location)).slice(0, 5);


    res.render("explore", {
        topRestaurants: topRestaurants,
        editorsChoice: editorsChoice,
        popularAroundYou: popularAroundYou
    })

}

async function findById(id) {
    try {
        const resto = await Restaurant.findById(id).exec();
        if (resto){
            return true;
        }
    } catch (error) {
        return false;
    }
}

function convertToAMPM(time) {
    var timeSplit = time.split(":");
    var hours = parseInt(timeSplit[0]);
    var minutes = parseInt(timeSplit[1]);

    var period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;


    return hours + ':' + minutes + ' ' + period;
}

function formatDay(day){
    switch(day){
        case "Monday": 
            return "M";
        case "Tuesday":
            return "T";
        case "Wednesday": 
            return "W";
        case "Thursday":
            return "H";
        case "Friday": 
            return "F";
        case "Saturday":
            return "SA";
        case "Sunday":
            return "S";
    }

}

async function addRestaurant(req, res) {
        const { restoName, address, tags, pricestart, priceend, daysopenstart, daysopenend, operatinghourstart, operatinghourend, shortdesc, desc, 
        attri1,
        attri2,
        attri3,
        attri4,
        attri5,
        attri6,
        attri7,
        attri8,
        attri9,
        attri10,
        attri11,
        attri12 } = req.body;

    let avatarFilename = req.file ? req.file.filename : 'default-avatar.png';

    let formatStartHour = convertToAMPM(operatinghourstart);
    let formatEndHour = convertToAMPM(operatinghourend);

    let formatStartDay = formatDay(daysopenstart);
    let formatEndDay = formatDay(daysopenend);

    let name = restoName.replace(/\s/g, '').toLowerCase();
    let password = "12345678";
    let coordinates = [0, 0];
    let numberOfCash = 0;
    let priceS = Number(pricestart);
    let priceE = Number(priceend);

    try {
        const newRestaurant = new Restaurant({
            name: restoName,
            username: name,
            password: password,
            coordinates: coordinates,
            numberOfCash: numberOfCash,
            location: address,
            tag: tags,
            startPriceRange: priceS,
            endPriceRange: priceE,
            startOpeningDay: formatStartDay,
            endOpeningDay: formatEndDay,
            startOpeningHour: formatStartHour,
            endOpeningHour: formatEndHour,
            shortDescription: shortdesc,
            description: desc,
            media: avatarFilename,
            amenities: [
                attri1 ? 1 : 0, 
                attri2 ? 1 : 0,
                attri3 ? 1 : 0,
                attri4 ? 1 : 0,
                attri5 ? 1 : 0,
                attri6 ? 1 : 0,
                attri7 ? 1 : 0,
                attri8 ? 1 : 0,
                attri9 ? 1 : 0,
                attri10 ? 1 : 0,
                attri11 ? 1 : 0,
                attri12 ? 1 : 0
              ]
        });

        console.log(newRestaurant);

        await newRestaurant.save();

        console.log("Saved!");

        res.redirect('/login');

    } catch (error) {
        console.error('Error saving restaurant:', error);
        res.status(500).send("Error saving restaurant");
    }
}

async function editRestaurant(req,res) {
    const restoId = req.session.userId;
    
    const { restoName, address, tags, pricestart, priceend, daysopenstart, daysopenend, operatinghourstart, operatinghourend, shortdesc, desc, 
        attri1,
        attri2,
        attri3,
        attri4,
        attri5,
        attri6,
        attri7,
        attri8,
        attri9,
        attri10,
        attri11,
        attri12 } = req.body;

        let formatStartHour = convertToAMPM(operatinghourstart);
        let formatEndHour = convertToAMPM(operatinghourend);
    
        let formatStartDay = formatDay(daysopenstart);
        let formatEndDay = formatDay(daysopenend);

        let priceS = Number(pricestart);
        let priceE = Number(priceend);

        try {
            let updateDetails = {
                name: restoName,
                location: address,
                tag: tags,
                startPriceRange: priceS,
                endPriceRange: priceE,
                startOpeningDay: formatStartDay,
                endOpeningDay: formatEndDay,
                startOpeningHour: formatStartHour,
                endOpeningHour: formatEndHour,
                shortDescription: shortdesc,
                description: desc,
                amenities: [
                    attri1 ? 1 : 0, 
                    attri2 ? 1 : 0,
                    attri3 ? 1 : 0,
                    attri4 ? 1 : 0,
                    attri5 ? 1 : 0,
                    attri6 ? 1 : 0,
                    attri7 ? 1 : 0,
                    attri8 ? 1 : 0,
                    attri9 ? 1 : 0,
                    attri10 ? 1 : 0,
                    attri11 ? 1 : 0,
                    attri12 ? 1 : 0
                  ]
            };
            const editResto = await Restaurant.findByIdAndUpdate(restoId, updateDetails, { new: true });
    
            res.redirect(`/resto-responsepage/${restoId}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send("Internal Server Error");
        }
};

async function deleteRestaurant(req, res) {
    try {
        const { id } = req.params;

        const currentDate = new Date();

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: { deletedAt: currentDate } },
            { new: true } // Return the updated document
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.redirect('/');

    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {  addRestaurant, 
                    editRestaurant,
                    deleteRestaurant,
                    handleSearchRequest, 
                    addBulkResto, 
                    handleGetAllRestoRequest, 
                    getRestoCardDetails, 
                    filterRestaurants, 
                    handleExploreRequest, 
                    findById, 
                    isValidRestaurant,
                    addAReviewToRestaurant };
