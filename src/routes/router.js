const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const profileController = require('../controllers/profileController');
const app = express();

const Profile = require("../models/Profile"); 
const Review = require('../models/Review');

// Import controllers for restaurant and review handling
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController');
const { handleRestoPageRequest } = require('../controllers/reviewPageController');

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

// Static page routes
router.get('/signup', (req, res)=> res.render("signup"));
router.get('/login', (req, res) => res.render("login"));
router.get('/explore', (req, res) => res.render("explore"));
router.get(['/', '/index'], (req, res) => res.render("index", { loggedIn: !!req.session.userId }));

/*Login Post */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Profile.findOne({ username });
        if (user && password === user.password) {
            req.session.userId = user._id;
            return res.redirect("/own-profile");
        } else {
            return res.status(401).send("Incorrect username or password.");
        }
    } catch (error) {
        console.error('Error during login process:', error);
        return res.status(500).send("Internal Server Error");
    }
});

//log in with reviews route

router.get('/own-profile', isAuthenticated, async (req, res) => {
    try {
        const profile = await Profile.findById(req.session.userId)
                                     .populate('reviews') 
                                     .populate('likedReviews')   
                                     .exec();

        if (!profile) {
            return res.status(404).send('Profile not found');
        }
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

//signup
router.post('/signup', upload.single('avatar'), async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, tasteProfile } = req.body;
        const avatarPath = req.file ? req.file.path : 'defaultAvatarPath'; // Use a default path or handle as needed

        const newProfile = new Profile({
            firstName,
            lastName,
            username,
            email,
            password,
            tasteProfile,
            image: avatarPath,
            // Add other fields as needed
        });

        await newProfile.save();
        res.redirect('/login'); // Or handle accordingly
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error during signup');
    }
});

module.exports = router;



// Export the router
module.exports = router;
