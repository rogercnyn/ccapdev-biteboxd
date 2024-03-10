const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const path = require('path');

const Profile = require("../models/Profile"); 
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');


// Import controllers for restaurant and review handling
const { handleSearchRequest, handleGetAllRestoRequest, handleSortRequest } = require('../controllers/restaurantController');
const { handleRestoPageRequest, handleRestoResponsePageRequest } = require('../controllers/reviewPageController');
const {loginUser, createUser, editProfile, deleteReview, updateReview, logout, login, handleOwnProfile} = require('../controllers/profileController');
const {isAuthenticated, isAuthorizedForReviewAction} = require('../middleware/auth');
const router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

//Multer - for uploads ( used sa Sign up and edit profile, review)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/avatars/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: true }));


// Public routes for restaurant and review handling
router.get('/all', handleGetAllRestoRequest);
router.get('/search', handleSearchRequest);
router.get('/resto-reviewpage/:_id', handleRestoPageRequest);
router.get('/resto-responsepage/:_id', handleRestoResponsePageRequest);
router.get('/api/search/sort', handleSortRequest);


router.get('/signup', (req, res)=> res.render("signup"));
router.get('/login', (req, res) => res.render("login"));
router.get('/explore', (req, res) => res.render("explore"));
router.get(['/', '/index'], (req, res) => res.render("index", { loggedIn: !!req.session.userId }));
router.get('/createrestaurant', (req, res) => res.render("createrestaurant"));

// Routes for profile handling
router.post('/signup', upload.single('avatar'), createUser);
router.post("/edit-profile", isAuthenticated, upload.single('profilePic'),editProfile);
router.post('/deleteReview', isAuthorizedForReviewAction, deleteReview);
router.post('/updateReview', upload.array('editMedia'), updateReview)
router.post("/login", login);

router.get('/logout', logout);
router.get('/own-profile', isAuthenticated, handleOwnProfile);



// Example server-side route for sorting
router.get('/api/search/sort', (req, res) => {
    const criteria = req.query.criteria;
    // Assume getSortedResults is a function that returns sorted data based on criteria
    getSortedResults(criteria).then(sortedResults => {
        res.render('partials/sortedResults', { results: sortedResults, hasResults: sortedResults.length > 0 });
    }).catch(error => {
        // Handle errors
        res.status(500).send('Error processing request');
    });
});

router.get('/api/search/filter', async (req, res) => {
    try {
        const results = await filterRestaurants(req);
        res.render('sortedResults', { results, hasResults: results.length > 0 });
    } catch (error) {
        res.status(500).send('Error processing filter request');
    }
});

// will redirect to login if the link resto-responsepage without the corresponding id is provided
router.get('/resto-responsepage', (req, res) => {
    res.redirect('/login');
});

router.get('/sort', function(req, res) {
    const criteria = req.query.criteria;
    // Call the function to sort the results based on the criteria
    // This will depend on how your data is structured and stored on the server
    // Return the sorted results in the response
    res.render('sortedResults', { /* Pass the sorted results to the template */ });
});



router.post("/createrestaurant", upload.single('restopicture'), async (req, res) => {

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

            startOpeningDay: daysopenstart,

            endOpeningDay: daysopenend,

            startOpeningHour: operatinghourstart,

            endOpeningHour: operatinghourend,

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

        res.status(200).send("Restaurant data received and saved!");

    } catch (error) {

        console.error('Error saving restaurant:', error);

        res.status(500).send("Error saving restaurant");

    }

});

router.post('/api/search/filter', async (req, res) => {
    const { rating, city, minReviewers, price } = req.body;

    // Construct the query based on provided filters
    let query = {};

    // Filter by rating if provided
    if (rating > 0) {
        query.rating = { $gte: Math.floor(rating) }; // Floor the rating
    }

    // Filter by city if provided
    if (city) {
        query.city = { $regex: new RegExp(city, 'i') }; // Case-insensitive search
    }

    // Filter by minimum number of reviewers if provided
    if (minReviewers) {
        query.numberOfReviews = { $gte: parseInt(minReviewers) };
    }

    // Example: Filter by price range if provided
    // This is just a placeholder. Adjust according to your actual price storage and filter logic.
    if (price) {
        query.numberOfCash = { $gte: parseInt(price) }; // Assuming 'price' indicates the minimum number of cash
    }

    try {
        let results = await Restaurant.find(query).lean(); // Fetch filtered results

        if (rating > 0) {
            results = floorTheRating(results); // Apply floor rating functionality
        }

        res.json(results); // Send the results back to the client
    } catch (error) {
        console.error('Error processing filter request:', error);
        res.status(500).send('Error processing request');
    }
});


module.exports = router;