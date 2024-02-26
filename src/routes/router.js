const { Router }= require('express');
const path = require('path');
const fs = require('fs');


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



module.exports = router;