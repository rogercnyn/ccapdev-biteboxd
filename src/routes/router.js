const { Router } = require('express');
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController');
const { handleRestoPageRequest } = require('../controllers/reviewPageController');


const router = Router();
const Profile = require("../models/Profile");
const Review = require('../models/Review');
const path = require('path');
const multer = require('multer');

const bodyParser = require('body-parser');
const session = require('express-session');

const express = require('express');

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

router.use(bodyParser.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}


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
                                    .populate({
                                    path: 'likedReviews',
                                    populate: {
                                        path: 'user',
                                        model: 'Profile'
                                    }
                                    })
                                    .exec();
                                    
        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        const profileData = profile.toObject({ virtuals: true });

        // Adjust the main profile image path
        profileData.image = profileData.image.startsWith('uploads/avatars/') 
                            ? profileData.image : `uploads/avatars/${profileData.image}`;

        console.log(profileData);
        if (profileData.reviews) {
            console.log(profileData.reviews);
        }

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

const fs = require('fs');
const dir = './public/uploads/avatars/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/signup', upload.single('avatar'), async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, tasteProfile } = req.body;
        const imagePath = req.file ? 'uploads/avatars/' + req.file.filename : 'uploads/avatars/default-avatar.png'; 

        const processedTasteProfile = Array.isArray(tasteProfile) ? tasteProfile : (tasteProfile ? tasteProfile.split(',') : []);

        const newProfile = new Profile({
            firstName,
            lastName,
            username,
            email,
            password,
            tasteProfile: processedTasteProfile,
            image: imagePath,
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

router.post('/edit-profile', isAuthenticated, upload.single('profilePic'), async (req, res) => {
    try {
        const userId = req.session.userId;
        const { firstName, lastName, bio } = req.body;
        let profileUpdate = {
            firstName: firstName,
            lastName: lastName,
            bio: bio
        };

        if (req.file) {
            profileUpdate.image = 'uploads/avatars/' + req.file.filename;
        }

        await Profile.findByIdAndUpdate(userId, profileUpdate, { new: true });

        res.redirect('/own-profile'); 
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Failed to update profile');
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
