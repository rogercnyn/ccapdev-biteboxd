const express = require('express');
const server = express();

const handlebars = require('express-handlebars');

const mongoose = require('mongoose');
const path = require("path")

const dotenv = require('dotenv');
dotenv.config();

function connect() {
    return mongoose.connect(process.env.MONGODB_URI);
}
server.use(express.static(path.join(__dirname, 'public')));

server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        times: function(n, block) {
            let accum = '';
            for (let i = 0; i < n; ++i) {
                accum += block.fn(i);
            }
            return accum;
        }
    },
    defaultLayout: false,
    allowProtoPropertiesByDefault: true
}));
server.set("views", "./src/views");

server.use(express.static('public'));

const bodyParser = require('body-parser');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const {searchQuery} = require('./src/routes/searchController.js')

server.get('/', function(req, resp){
	resp.render("index");
    
});



server.get('/search', function(req, resp){
    const query = req.query.query;
    console.log(query)
    searchQuery(query)
        .then(results => {
            console.log(typeof(results))
    //         Array.from(results).forEach(result => result["_id"] = "")
            // const data = { results: JSON.parse(JSON.stringify(results)), query };
    //         console.log(results)

            resp.render("search", {
                results: results
            });
        })
    //     .catch(error => {
    //         console.error('Error searching:', error);
    //         resp.status(500).send('Internal Server Error');
    // });    
});


//Upto here

const port = process.env.PORT | 9090;
server.listen(port, async function() {
    console.log(`express server is now listening on port ${port}`);
    try {
        await connect();
        console.log(`Now connected to MongoDB`);

    } catch (err) {
        console.log('Connection to MongoDB failed: ');
        console.error(err);
    }
});
