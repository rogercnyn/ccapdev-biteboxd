require('dotenv').config(); 

const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const exphbs = require('express-handlebars');
const path = require("path");
const connect = require('./src/models/db.js');
const { loadProfiles, loadRestaurants, loadReviews, loadRestaurantReplies } = require('./src/routes/loader.js');
const router = require('./src/routes/router.js');


const app = express();

function initializeSessionManagement(){
    app.use(session({
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store: new MemoryStore({
          checkPeriod: 86400000 
        }),
        resave: false,
        secret: 'keyboard cat',
        saveUninitialized: true
    }))
}

function initializeStaticFolders() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/uploads', express.static('public/uploads'));

}

function formatDate(date) {
    if (!date) return "";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return ""; 
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true
    };
    return dateObj.toLocaleDateString('en-US', options);
}

function initializeHandlebars() {
    app.engine("hbs", exphbs.engine({
        extname: "hbs",
        defaultLayout: false,
        helpers: {
            formatDate: formatDate,
            formatEdit: function(date){
                let dateString = formatDate(date);
                if(dateString === "") { return ""}
                return "Edited: " + dateString;
            },
            times: function(n, block) {
                let accum = '';
                for (let i = 0; i < n; ++i) {
                    accum += block.fn(i);
                }
            return accum;
            },
            timesInverse: function(n, block) {
                let accum = ''; 
                for (let i = 0; i < 5-n; i++) {
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
            }, 
            isSelectedDay: function(day, selectDay){
                return day === selectDay;
            },
            formatTime: function(timeString) {
                const [time, period] = timeString.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                let hours24 = hours;

                if (period === 'PM' && hours !== 12) {
                    hours24 += 12;
                } else if (period === 'AM' && hours === 12) {
                    hours24 = 0;
                }

                const formattedHours = String(hours24).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');

                return `${formattedHours}:${formattedMinutes}:00`;
            },  
            addSpaceForTags: function(tags){
                if (!Array.isArray(tags)) {
                    return '';
                }
            
                return tags.join(', ').trim();
            },
            getFirstFiveDecimals: function(number) {
                if (typeof number !== 'number') {
                    return 'Invalid number';
                }
                const numberString = number.toString();
                const decimalIndex = numberString.indexOf('.');
                if (decimalIndex === -1) {
                    return numberString;
                }

                return numberString.substring(0, decimalIndex + 6);
            }
        }
    }));
    app.set("view engine", "hbs");
    app.set("views", "./src/views");
}


async function main(){
    initializeSessionManagement();
    initializeStaticFolders();
    initializeHandlebars();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));    
    app.use(router);

    
    app.listen(process.env.SERVER_PORT, async () => {
        console.log(`Express server is now listening on port ${process.env.SERVER_PORT}`);
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
}



main();