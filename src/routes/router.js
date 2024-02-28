const { Router }= require('express');
const path = require('path');
const fs = require('fs');

// [BOOKMARK] -> DELETE WHEN IMPLEMENTING

// [BOOKMARK] DELETE ME 
const {test} = require('./trial.js')


const router = Router();
const viewsDir = path.join(path.resolve(__dirname, '..'), 'views');
const htmlFiles = fs.readdirSync(viewsDir) .filter(file => path.extname(file) === '.html');

function routeToFile(fileName) {
    return async function(req, res) {
        const filePath = path.join(viewsDir, fileName);
        res.sendFile(filePath);
    };
}


console.log(htmlFiles)
htmlFiles.forEach(fileName => 
    router.get(`/${fileName}`, routeToFile(fileName))    
)


router.get('/', routeToFile('index.html'));

// [BOOKMARK] DELET ME
// ITO LANG DAPAT MODELS
// arrangement: restaurant, profile, ratingset, review, restaurant reply 
// 1. FOLLOW THE ARRANGEMENT
// 2. DO THE MODEL JS FILE (try to do it as it is wag na magcomment out ng may unique or reference)
// 3. GO TO SAMPLE DATA, IMPORT THE JS FILE, ADD SA DROPALL
// 4. IN SAMPLEDATA.JS, INSTANTIATE A DOCUMENT, EXPORT IT
// 5. IN SAMPLEDATALOADER.JS, CREATE A FUNCTION, EXPORT IT
// 6. IN TRIAL.JS ADJUST TO IMPORT THE SAMPLEDATALOADER FUNCTION

test()


module.exports = router;