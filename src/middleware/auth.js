exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
};

exports.checkSession =(req, res, next) => {
    res.locals.loggedIn = req.session && req.session.loggedIn ? req.session.loggedIn : false;
    res.locals.profilePicture = req.session && req.session.profilePicture ? req.session.profilePicture : null;
    next();
};