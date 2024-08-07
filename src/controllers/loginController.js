const Profile = require('../models/Profile');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');


async function loginUser(req, username, password) {
    try {
        const userProfile = await Profile.findOne({ username });
        if (userProfile) {
            const isMatchUserProfile = await bcrypt.compare(password, userProfile.password);
            if (isMatchUserProfile) {
                req.session.userId = userProfile._id;
                req.session.username = userProfile.username;
                req.session.profilePicture = userProfile.image;
                req.session['loggedIn'] = true;
                req.session['isResto'] = false;
                return { success: true, redirectUrl: "/" };
            }
        } else {
            const restaurantUser = await Restaurant.findOne({ username });
            if (restaurantUser) { 
                const isMatchRestoProfile = await bcrypt.compare(password, restaurantUser.password);
                if (isMatchRestoProfile) {
                    req.session.userId = restaurantUser._id;
                    req.session.username = restaurantUser.username;
                    req.session.profilePicture = restaurantUser.media;
                    req.session['loggedIn'] = true;
                    req.session['isResto'] = true;
                    return { success: true, redirectUrl: "/resto-responsepage/" + restaurantUser._id };
                }
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
async function login(req, res) {
    const { username, password } = req.body;
    const loginResult = await loginUser(req, username, password);

    if (loginResult.success) {
        return res.redirect(loginResult.redirectUrl);
    } else {
        const redirectUrl = loginResult.statusCode === 500 ? '/error' : `/login?loadError=true`;
        return res.redirect(redirectUrl);
    }
}


module.exports = {login, logout}