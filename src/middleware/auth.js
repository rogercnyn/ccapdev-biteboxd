const Profile = require('../models/Profile');
const Review = require('../models/Review');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next(); // Proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: 'You are not authorized to view this page' });
    }
}



async function checkSession(req,res) {
    res.locals.loggedIn = req.session && req.session.loggedIn ? req.session.loggedIn : false;
    res.locals.profilePicture = req.session && req.session.profilePicture ? req.session.profilePicture : null;
    next();
};

async function isAuthorizedForReviewAction(req, res, next) {
    const { reviewId } = req.body; // Assuming reviewId is passed in the body
    const username = req.session.username; // Assuming the username is stored in the session upon login

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the logged-in user is the author of the review
        if (review.username === username || req.session.isAdmin) { // Additionally checking for admin privilege
            next(); // User is authorized to proceed
        } else {
            res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'An error occurred during authorization' });
    }
}


module.exports = {
    isAuthenticated,
    checkSession,
    isAuthorizedForReviewAction
}