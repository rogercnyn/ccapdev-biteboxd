const dotenv = require('dotenv');
dotenv.config();

// dependencies
const express = require('express')
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require("path")

//  requires dot env configuration already
const connect = require('./src/models/db.js');
const { loadProfiles, loadRestaurants, loadReviews, loadRestaurantReplies } = require('./src/routes/loader.js')
const router = require('./src/routes/router.js');


const PORT = 3000;


async function main() {
    const server = express();

    server.use(express.static(path.join(__dirname, 'public')));
    server.use(router);


    server.set("view engine", "hbs");

    server.engine("hbs", exphbs.engine({
        extname: "hbs", 
        helpers: {
            formatDate: function(date) {
                return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
            },
            times: function(n, block) {
                let accum = '';
                for (let i = 0; i < n; ++i) {
                    accum += block.fn(i);
                }
                return accum;
            },
            get: function(array, index, compare) {
                return array[index] === compare;
            },
            isVideo: function(string){
                return string.endsWith(".mp4") 
            }  
        },
        defaultLayout: false
        
    }));
    server.set("views", "./src/views");

    server.use(session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true
    }));

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(router);
    

    server.listen(PORT, async function() {
        console.log(`express server is now listening on port ${PORT}`);
        try {
            await connect();
            console.log(`Now connected to MongoDB`);
            await loadRestaurants()
            await loadProfiles()
            await loadReviews()
            await loadRestaurantReplies()
        } catch (err) {
            console.log('Connection to MongoDB failed: ');
            console.error(err);
        }
    });


}


main();