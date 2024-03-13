const Profile = require('../models/Profile');
const Restaurant = require('../models/Restaurant');


async function loginUser(req, username, password) {
    try {
        const userProfile = await Profile.findOne({ username });
        if (userProfile && password === userProfile.password) {
            req.session.userId = userProfile._id;
            req.session.username = userProfile.username;
            req.session.profilePicture = userProfile.image;
            req.session['loggedIn'] = true;
            req.session['type'] = 'user';
            return { success: true, redirectUrl: "/" };
        } else {
            const restaurantUser = await Restaurant.findOne({ username });
            if (restaurantUser && password === restaurantUser.password) {
                req.session.userId = restaurantUser._id;
                req.session.username = restaurantUser.username;
                req.session.profilePicture = restaurantUser.media;
                req.session['loggedIn'] = true;
                req.session['type'] = 'restaurant';

                return { success: true, redirectUrl: "/resto-responsepage/" + restaurantUser._id };
            }
        }
        return { success: false, message: "Incorrect username or password." };
    } catch (error) {
        console.error('Error during login process:', error);
        return { success: false, message: "Internal Server Error", statusCode: 500 };
    }
}

async function logout(req,res) {
    req.session.destroy(() => {
        res.redirect('/'); 
    });
};

async function login(req,res) {
    const { username, password } = req.body;
    const loginResult = await loginUser(req, username, password);

    if (loginResult.success) {
        res.redirect(loginResult.redirectUrl);
    } else {
        if (loginResult.statusCode) {
            res.status(loginResult.statusCode);
        } else {
            res.status(401);
        }
        res.send(loginResult.message);
    }
};



module.exports = {login, logout}