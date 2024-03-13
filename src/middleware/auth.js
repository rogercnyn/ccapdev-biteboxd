
function isAuthenticated(req, res, next) {
    res.locals.loggedIn = req.session.userId ? true : false;
    res.locals.profilePicture = req.session.profilePicture || 'defaultProfilePic.png'; // Adjust default profile picture as necessary
    next();
}

module.exports = {isAuthenticated};