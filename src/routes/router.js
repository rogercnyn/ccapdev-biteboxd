const { Router }= require('express');
const path = require('path');
const fs = require('fs');
const {searchQuery} = require('./searchController.js')

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

router.get('/search', function(req, resp){
    // console.log(req)
    const query = req.query.query;
    console.log(query)
    results = searchQuery(query)
    console.log(results)
    resp.render("search", {
        results
    })

})

router.get('/', function(req, resp){
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