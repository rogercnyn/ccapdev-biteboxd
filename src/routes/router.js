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
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController');
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
        const user = await Profile.findOne({ username });
        if (user && password === user.password) {
            req.session.userId = user._id; 
            req.session.username = user.username;
            req.session.profilePicture = user.image
            req.session['loggedIn'] = true
            res.redirect("/");
        } else {
            return res.status(401).send("Incorrect username or password.");
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



module.exports = router;