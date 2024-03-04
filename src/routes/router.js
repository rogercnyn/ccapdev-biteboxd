const { Router } = require('express');
const { handleSearchRequest, handleGetAllRestoRequest } = require('../controllers/restaurantController')
const { handleRestoPageRequest }  = require('../controllers/reviewPageController')
const router = Router();

router.get('/all', handleGetAllRestoRequest)

router.get('/search', handleSearchRequest);

router.get('/resto-reviewpage/:_id', handleRestoPageRequest)

// // gawan sa controller pero kahit ganyan muna
// router.get('/resto-reviewpage', function(req, resp){
//     resp.render("resto-reviewpage")
// })


router.get('/explore', function(req, resp){
    resp.render("explore")    
})



router.get('/', function(req, resp){
    resp.render("index")
})


router.get('/index', function(req, resp){
    resp.render("index")
})


module.exports = router;