
function isAuthenticated(req, res, next) {
    // console.log(req.session)
    res.locals.loggedIn = req.session.userId ? true : false;
    res.locals.profilePicture = req.session.profilePicture || 'defaultProfilePic.png'; // Adjust default profile picture as necessary
    res.locals.isResto = req.session.isResto;
    res.locals.loggedUsername = req.session.username
    res.locals.userId = req.session.userId;
    next();
}

module.exports = {isAuthenticated};