const { Router }= require('express');
const path = require('path');
const fs = require('fs');
const { searchQuery, getAllRestaurant } = require('./restaurantController.js')

// [BOOKMARK] -> DELETE WHEN IMPLEMENTING

// [BOOKMARK] DELETE ME 
const {test} = require('./trial.js');


const router = Router();
const viewsDir = path.join(path.resolve(__dirname, '..'), 'views');
const pages = fs.readdirSync(viewsDir)
    .filter(file => path.basename(file) != 'search' && path.extname(file) === '.hbs')
    .map(file => path.basename(file, path.extname(file)));

// pages.forEach(fileName => { 
//         console.log(fileName)
//         router.get(`/${fileName}`, function(req, resp){
//             resp.render(`${fileName}`);
//         })
//     }
// )

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
                query: query
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

// [BOOKMARK] DELET ME
// ITO LANG DAPAT MODELS
// arrangement: restaurant, profile, ratingset, review, restaurant reply 
// 1. FOLLOW THE ARRANGEMENT
// 2. DO THE MODEL JS FILE (try to do it as it is wag na magcomment out ng may unique or reference)
// 3. GO TO SAMPLE DATA, IMPORT THE JS FILE, ADD SA DROPALL
// 4. IN SAMPLEDATA.JS, INSTANTIATE A DOCUMENT, EXPORT IT
// 5. IN SAMPLEDATALOADER.JS, CREATE A FUNCTION, EXPORT IT
// 6. IN TRIAL.JS ADJUST TO IMPORT THE SAMPLEDATALOADER FUNCTION

test();



module.exports = router;