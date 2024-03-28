const express = require('express');
const multer = require('multer');
const path = require('path');
// DO NOT IMPORT MODELS HERE

// Import controllers for restaurant and review handling
const { handleSearchRequest, handleGetAllRestoRequest, handleExploreRequest, addRestaurant, editRestaurant } = require('../controllers/restaurantController');
const { handleRestoPageRequest, handleRestoResponsePageRequest } = require('../controllers/reviewPageController');
const { handleCreateReviewRequest, handleLikeReviewRequest, handleEditReviewRequest } = require('../controllers/reviewController');
const { handleProfileRequest, createUser, editProfile, updateReview} = require('../controllers/profileController');
const { login, logout} = require('../controllers/loginController');
const {isAuthenticated} = require('../middleware/auth');
const router = express.Router();

// for delete only
const { deleteRestaurant, deleteReview } = require('../controllers/deleteController');


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


const storageReviewMedia = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/reviewMedia/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });


const uploadReviewMedia =  multer({
    storage: storageReviewMedia,
    limits: {
        fileSize: 25 * 1024 * 1024, 
        files: 4 
    }
}).array('files', 4); 

  

// configure middleware
router.use(isAuthenticated)


// Public routes for restaurant and review handling
router.get('/all', handleGetAllRestoRequest);
router.get('/search', handleSearchRequest);

router.get('/resto-reviewpage/:_id', handleRestoPageRequest);
router.post('/resto-reviewpage/:_id/create', uploadReviewMedia, handleCreateReviewRequest);
router.post('/resto-reviewpage/:_id/:_reviewId/edit', uploadReviewMedia, handleEditReviewRequest);
router.post('/resto-reviewpage/:_id/:_reviewId/delete', deleteReview);
router.get('/resto-reviewpage/:_id/:_reviewId/like', handleLikeReviewRequest);


router.get('/resto-responsepage/:_id', handleRestoResponsePageRequest);


router.get('/signup', (req, res)=> res.render("signup"));
router.get('/login', (req, res) => res.render("login"));
router.get('/explore', handleExploreRequest);
router.get(['/', '/index'], (req, res) => res.render("index"));
router.get('/createrestaurant', (req, res) => res.render("createrestaurant"));

// Routes for profile handling
router.post('/signup', createUser);
router.post("/edit-profile", upload.single('profilePic'),editProfile);
router.post('/deleteReview', deleteReview);
router.post('/updateReview', upload.array('editMedia'), updateReview)
router.post("/login", login);

router.get('/logout', logout);
router.get('/profile/:username', handleProfileRequest)

// Routes for resto
router.post("/createrestaurant", upload.single('restopicture'), addRestaurant)
router.post("/editrestaurant", editRestaurant)
router.post('/resto-responsepage/:id/delete', deleteRestaurant)

// // Example server-side route for sorting
// router.get('/api/search/sort', (req, res) => {
//     const criteria = req.query.criteria;
//     // Assume getSortedResults is a function that returns sorted data based on criteria
//     getSortedResults(criteria).then(sortedResults => {
//         res.render('partials/sortedResults', { results: sortedResults, hasResults: sortedResults.length > 0 });
//     }).catch(error => {
//         // Handle errors
//         res.status(500).send('Error processing request');
//     });
// });

// // will redirect to login if the link resto-responsepage without the corresponding id is provided
router.get('/resto-responsepage', (req, res) => {
    res.redirect('/login');
});


// // will redirect to index if the called link is not found
router.get('*', (req, res) => {
    res.redirect('/');
});


const { addRestaurantReply } = require('../controllers/restaurantreplyController');

router.post('/resto-responsepage/:restaurantId', addRestaurantReply);
module.exports = router;