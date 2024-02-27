const { Router }= require('express');
const path = require('path');
const fs = require('fs');
const Review = require('../models/Review.js')

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



const sampleReview = new Review({
    rating: 4,
    foodRating: 4,
    serviceRating: 5,
    affordabilityRating: 3,
    noOfLikes: 10,
    noOfDislikes: 2,
    title: 'Sample Review Title',
    body: 'This is a sample review body text.',
    media: ['media_url_1', 'media_url_2'],
});

// Save the document to the database
sampleReview.save()
    .then(savedReview => {
        console.log('Sample review saved successfully:', savedReview);
    })
    .catch(error => {
        console.error('Error saving sample review:', error);
    });

module.exports = router;