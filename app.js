const express = require('express')
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const router = require('./src/routes/router.js');
const path = require("path")

const PORT = 3000;

dotenv.config();

function middleware(req, res, next) {
    console.log('Middleware executed');
    next(); 
}


async function main() {
    const app = express();

    app.use(express.static(path.join(__dirname, 'public')));

    app.engine("hbs", exphbs.engine({
        extname: "hbs", 
        helpers: {
            formatDate: function(date) {
                return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
            }
        }
    }));
    app.set("view engine", "hbs");
    app.set("views", "./src/views");


    app.use(express.json());
    // Apply routes to express app
    // app.use(middleware)
    app.use(router);

    app.listen(PORT, async function() {
        console.log(`express app is now listening on port ${PORT}`);
    });
}


main();