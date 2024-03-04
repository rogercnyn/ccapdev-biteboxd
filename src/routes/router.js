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


router.use(bodyParser.urlencoded({ extended: true }));

router.get('/all', handleGetAllRestoRequest);

router.get('/search', handleSearchRequest);

router.get('/resto-reviewpage/:_id', handleRestoPageRequest);

router.post("/login", async (req, res) => {
    try {
        console.log(req.body.username); 
        const profile = await Profile.findOne({ username: req.body.username });
        if (profile && profile.password === req.body.password) {
            req.session.userId = profile.id; 
            res.redirect("/"); 
        //  res.redirect("/"); 
        } else {
            res.send("Wrong username or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/', function(req, res) {
    const loggedIn = req.session && req.session.loggedIn ? req.session.loggedIn : false;
    res.render('index', { loggedIn });
});

router.get('/explore', function(req, resp){
    resp.render("explore")    
});

router.get('/index', function(req, resp){
    resp.render("index");
});

router.get('/', function(req, resp){
    resp.render("index");
});

router.get('/login', function(req,res){
    res.render("login");
});

router.get('/own-profile', function(req, res) {
    res.render('own-profile');
});

module.exports = router;
