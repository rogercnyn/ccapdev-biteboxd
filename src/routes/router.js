const { Router } = require('express');
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController');
const { handleRestoPageRequest } = require('../controllers/reviewPageController');

const router = Router();
const Profile = require("../models/Profile");
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(session({
    secret: 'try',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 } // 14 days in milliseconds
}));


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
    try {
        const profile = await Profile.findOne({ username: req.body.username });
        if (profile && profile.password === req.body.password) {
            req.session.userId = profile.username; 
            req.session.profilePicture = profile.image
            req.session['loggedIn'] = true
            res.redirect("/"); 
        } else {
            res.send("Wrong username or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
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

router.get('/own-profile', function(req, res) {
    res.render('own-profile');
});

module.exports = router;
