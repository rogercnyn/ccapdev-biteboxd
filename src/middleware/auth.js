
function isAuthenticated(req, res, next) {
    const acceptedPaths = ['/createrestaurant', '/editrestaurant', '/resto-responsepage/:id/delete', '/resto-responsepage/:id/updatepicture', '/editrestopassword', '/logout'];
    // console.log(req.session)
    res.locals.loggedIn = req.session.userId ? true : false;
    res.locals.profilePicture = req.session.profilePicture || 'defaultProfilePic.png'; // Adjust default profile picture as necessary
    res.locals.isResto = req.session.isResto;
    res.locals.loggedUsername = req.session.username
    res.locals.userId = req.session.userId;

    const isInAcceptedPaths = acceptedPaths.some(path => {
        if (path.includes(':id')) {
            const actualPath = path.replace(':id', req.params.id);
            return req.path === actualPath;
        } else {
            return req.path === path;
        }
    });    

    if (res.locals.isResto && req.path.indexOf("/resto-responsepage") === -1 && !isInAcceptedPaths) {
        res.redirect('/resto-responsepage/' + req.session.userId);
    }
    else {
        next();
    }
}

module.exports = {isAuthenticated};