const dotenv = require('dotenv');
dotenv.config();

// dependencies
const express = require('express')
const exphbs = require('express-handlebars');
const path = require("path")

//  requires dot env configuration already
const connect = require('./src/models/db.js');
const router = require('./src/routes/router.js');



const PORT = 3000;


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
    app.use(router);

    app.listen(PORT, async function() {
        console.log(`express app is now listening on port ${PORT}`);
        try {
            await connect();
            console.log(`Now connected to MongoDB`);

        } catch (err) {
            console.log('Connection to MongoDB failed: ');
            console.error(err);
        }
    });
}


main();