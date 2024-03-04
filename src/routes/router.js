const { Router } = require('express');
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController')
const { handleRestoPageRequest }  = require('../controllers/reviewPageController')
const router = Router();
const Profile = require("../models/Profile");
const express = require('express');
const db = require("../models/db.js");



router.get('/all', handleGetAllRestoRequest)

router.get('/search', handleSearchRequest);

router.get('/resto-reviewpage/:_id', handleRestoPageRequest)

// // gawan sa controller pero kahit ganyan muna
// router.get('/resto-reviewpage', function(req, resp){
//     resp.render("resto-reviewpage")
// })

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/login", async (req, res) => {
    try {
        const profile = await Profile.findOne({ username: req.body.username });

        if (profile && profile.password === req.body.password) {
            
            req.session.loggedIn = true;
            console.log("User logged in:", req.session.loggedIn); 
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
    const loggedIn = req.session && req.session.loggedIn ? req.session.loggedIn : false;
    res.render('index', { loggedIn });
});



router.get('/explore', function(req, resp){
    resp.render("explore")    
})



router.get('/', function(req, resp){
    resp.render("index")
})


router.get('/index', function(req, resp){
    resp.render("index")
})


router.get('/login', function(req,res){
    res.render("login");
});

router.get('/own-profile', function(req, res) {
    res.render('own-profile');
});
module.exports = router;


