const { Router } = require('express');
const { searchQuery, getAllRestaurant } = require('./restaurantController.js')
const router = Router();

router.get('/all', function(req, resp){
    getAllRestaurant().then(results => {
            console.log(results)
            resp.render("all", {
                results: results    
            })
        }   
    )
})


router.get('/resto-reviewpage', function(req, resp){
    resp.render("resto-reviewpage")
})


router.get('/explore', function(req, resp){
    resp.render("explore")    
})

router.get('/search', function(req, resp){
    const query = req.query.query;
    console.log(query)
    searchQuery(query)
        .then(results => {
            console.log(results)
            resp.render("search", {
                results: results,
                query: query,
                hasResults: results.length !== 0
            });
        })
        .catch(error => {
            console.error('Error searching:', error);
            resp.status(500).send('Internal Server Error');
        });
});


router.get('/', function(req, resp){
    resp.render("index")
})


router.get('/index', function(req, resp){
    resp.render("index")
})


module.exports = router;