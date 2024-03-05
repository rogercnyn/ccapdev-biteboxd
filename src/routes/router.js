const { Router } = require('express');
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController');
const { handleRestoPageRequest } = require('../controllers/reviewPageController');

const router = Router();
const Profile = require("../models/Profile");
const Review = require('../models/Review');

const bodyParser = require('body-parser');
const session = require('express-session');

const express = require('express');
const multer = require('multer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

router.use(session({
    secret: 'try',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 } // 14 days in milliseconds
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

router.use(bodyParser.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

const upload = multer({ storage: storage });

function checkSession(req, res, next) {
    res.locals.loggedIn = req.session && req.session.loggedIn ? req.session.loggedIn : false;
    res.locals.profilePicture = req.session && req.session.profilePicture ? req.session.profilePicture : null;
    next();
}

router.use(checkSession)

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/all', handleGetAllRestoRequest);

router.get('/search', handleSearchRequest);

router.get('/resto-reviewpage/:_id', handleRestoPageRequest);

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

router.post('/signup', upload.single('avatar'), async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, tasteProfile } = req.body;
        const avatarPath = req.file ? req.file.path : 'defaultAvatarPath'; 

        const newProfile = new Profile({
            firstName,
            lastName,
            username,
            email,
            password,
            tasteProfile,
            image: avatarPath,
        });

        await newProfile.save();
        res.redirect('/login'); 
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error during signup');
    }
});



router.get('/', function(req, res) {
    res.render('index');
});

router.get('/explore', function(req, resp){
    resp.render("explore")    
});

router.get('/index', function(req, resp){
    resp.render("index");
});

router.get('/login', function(req,res){
    res.render("login");
});

router.get('/signup', function(req,res){
    res.render("signup")
});


module.exports = router;
