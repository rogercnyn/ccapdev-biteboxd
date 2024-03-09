require('dotenv').config(); 

const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require("path");
const app = express();
const connect = require('./src/models/db.js');
const { loadProfiles, loadRestaurants, loadReviews, loadRestaurantReplies } = require('./src/routes/loader.js');
const router = require('./src/routes/router.js');
const PORT = process.env.PORT || 3000; 


app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } 
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    // Make session data accessible to all templates
    res.locals.loggedIn = req.session.userId ? true : false;
    res.locals.profilePicture = req.session.profilePicture || 'defaultProfilePic.png'; // Adjust default profile picture as necessary
    next();
});
app.use('/uploads', express.static('public/uploads'));


app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: false,
    helpers: {
        formatDate: function(date) {
            if (!date) return "Invalid date";
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return "Invalid date"; 
            const options = { year: 'numeric', month: 'long' };
            return dateObj.toLocaleDateString('en-US', options);
        },
        times: function(n, block) {
            let accum = '';
            for (let i = 0; i < n; ++i) {
                accum += block.fn(i);
            }
        return accum;
        },
        formatMonthYear: function(date) {
            const options = { year: 'numeric', month: 'long' };
            return new Date(date).toLocaleDateString('en-US', options);
        },
        get: function(array, index, compare) {
            return array[index] === compare;
        },
        isVideo: function(string){
            return string.endsWith(".mp4") 
        }  
    }
}));
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, async () => {
    console.log(`Express server is now listening on port ${PORT}`);
    try {
        await connect();
        console.log(`Now connected to MongoDB`);
        await loadRestaurants();
        await loadProfiles();
        await loadReviews();
        await loadRestaurantReplies();
    } catch (err) {
        console.log('Connection to MongoDB failed:');
        console.error(err);
    }
});