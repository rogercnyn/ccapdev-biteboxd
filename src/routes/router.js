const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const profileController = require('../controllers/profileController');
const app = express();
const path = require('path');

const Profile = require("../models/Profile"); 
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');


// Import controllers for restaurant and review handling
const { handleSearchRequest, handleGetAllRestoRequest, handleSortRequest } = require('../controllers/restaurantController');
const { handleRestoPageRequest, handleRestoResponsePageRequest } = require('../controllers/reviewPageController');

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
        secure: true, // Note: Set to false if you're not using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires after 24 hours
    }
}));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/avatars/');
    },
    filename: function(req, file, cb) {
        // Generate a unique filename: You could use the user's ID, a timestamp, etc.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });



// Body parser middleware to parse request bodies
router.use(bodyParser.urlencoded({ extended: true }));

// Authentication middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Public routes for restaurant and review handling
router.get('/all', handleGetAllRestoRequest);
router.get('/search', handleSearchRequest);
router.get('/resto-reviewpage/:_id', handleRestoPageRequest);
router.get('/resto-responsepage/:_id', handleRestoResponsePageRequest);
router.get('/sort', handleSortRequest);


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
// router.post("/login", async (req, res) => {
//     try {
//         const profile = await Profile.findOne({ username: req.body.username });
//         if (profile && profile.password === req.body.password) {
//             req.session.userId = profile.username; 
//             req.session.profilePicture = profile.image
//             req.session['loggedIn'] = true
//             res.redirect("/"); 
//         } else {
//             res.send("Wrong username or password");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });
// Static page routes
router.get('/signup', (req, res)=> res.render("signup"));
router.get('/login', (req, res) => res.render("login"));
router.get('/explore', (req, res) => res.render("explore"));
router.get(['/', '/index'], (req, res) => res.render("index", { loggedIn: !!req.session.userId }));
router.get('/createrestaurant', (req, res) => res.render("createrestaurant"));

/*Login Post */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Try finding the user in the Profile collection
        const userProfile = await Profile.findOne({ username });

        if (userProfile && password === userProfile.password) {
            // If found in Profile, set session and redirect
            req.session.userId = userProfile._id;
            req.session.username = userProfile.username;
            req.session.profilePicture = userProfile.image;
            req.session['loggedIn'] = true;
            res.redirect("/");
        } else {
            // If not found in Profile, try finding in Restaurant collection
            const restaurantUser = await Restaurant.findOne({ username });

            if (restaurantUser && password === restaurantUser.password) {
                // If found in Restaurant, set session and redirect
                req.session.userId = restaurantUser._id;
                req.session.username = restaurantUser.username;
                req.session.profilePicture = restaurantUser.media;
                req.session['loggedIn'] = true;
                res.redirect("/resto-responsepage/" + restaurantUser._id);
            } else {
                // If not found in either collection, return error
                return res.status(401).send("Incorrect username or password.");
            }
        }
    } catch (error) {
        console.error('Error during login process:', error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get('/logout', function(req, res) {
    req.session.destroy(() => {
        res.redirect('/'); 
    });
});


router.get('/own-profile', isAuthenticated, async (req, res) => {
    try {
        const profile = await Profile.findById(req.session.userId)
                                     .populate('reviews') 
                                     .populate('likedReviews')   
                                     .exec();

        if (!profile) {
            return res.status(404).send('Profile not found');
        }
        // for (const review of profile.reviews) {
        //     const restaurant = await Restaurant.findById(review.restaurant);
        //     review.restaurantName = restaurant.name;
        // }
        const profileData = profile.toObject({ virtuals: true });

        console.log(profileData);

        res.render('own-profile', { 
            profile: profileData,
            reviews: profileData.reviews,
            likedReviews: profileData.likedReviews
        });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).send('Internal Server Error');
    }
});




router.post('/signup', upload.single('avatar'), async (req, res) => {
    try {
        console.log(req.body); 

        const { firstName, lastName, username, email, password } = req.body;
        const tasteProfilesString = req.body.tasteProfile; 

        if (!tasteProfilesString) {
            throw new Error("Taste profiles string is empty or null");
        }

        const tasteProfilesArray = JSON.parse(tasteProfilesString);
        const avatarFilename = req.file ? req.file.filename : 'default-avatar.png';
        const headerFilename = 'header.jpg';

        const newProfile = new Profile({
            firstName,
            lastName,
            username,
            email,
            password,
            tasteProfile: tasteProfilesArray,
            image: avatarFilename,
            bgImage: headerFilename,
            hearts: 0,
            dislike: 0,
            credibility: 0
        });

        await newProfile.save();
        res.redirect('/login'); 
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error during signup');
    }
});






router.post("/edit-profile", isAuthenticated, upload.single('profilePic'), async (req, res) => {
    const userId = req.session.userId;
    const { firstName, lastName, bio } = req.body;
    try {
        let profileUpdate = {
            firstName: firstName,
            lastName: lastName,
            bio: bio
        };
        if (req.file) {
            profileUpdate.image = req.file.filename;
            req.session.profilePicture = profileUpdate.image; 
        }
        const updatedProfile = await Profile.findByIdAndUpdate(userId, profileUpdate, { new: true });

        res.redirect("/own-profile");
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send("Internal Server Error");
    }
});

// delete Review in Profile
router.post('/deleteReview', async (req, res) => {
    const { reviewId } = req.body; 

    if (!reviewId) {
        return res.status(400).json({ message: 'Review ID not provided' });
    }

    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        await Profile.updateMany(
            { reviews: reviewId },
            { $pull: { reviews: reviewId } }
        );

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


router.post('/updateReview', upload.array('editMedia'), async (req, res) => {
    const { reviewId, editTitle, editBody, editFoodRating, editServiceRating, editAffordabilityRating } = req.body;

    console.log("Updating review ID: ", reviewId);
    console.log("Received data: ", req.body);

    try {
        const update = {
            title: editTitle,
            body: editBody,
            foodRating: editFoodRating,
            serviceRating: editServiceRating,
            affordabilityRating: editAffordabilityRating,
        };
        
        console.log("Update object: ", update);

        const updatedReview = await Review.findByIdAndUpdate(reviewId, update, { new: true });
        if (!updatedReview) {
            console.log("Review not found or update failed");
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        console.log("Updated review: ", updatedReview);
        res.json({ success: true, message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
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



module.exports = router;