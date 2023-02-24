//progress on code so far: can receive post requests, can send data to ejs files
//TODO: use mongodb to get random variable from database and pass to randomUrl var on line 72

const exp = require('constants');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
const { escape } = require('querystring');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen('6900', () => {
    console.log('listening on port 6900');
})

app.get('/', (req, res) => {
    const randomUrl = '';
    const randomSubmitter = 'N/a';
    res.render('index', { randomUrl, randomSubmitter })
});

app.get('/submit', (req, res) => {
    res.render('submit')
});

app.get('/success', (req, res) => {
    res.render('success');
})

//DATABASE CODE BELOW
const password = encodeURIComponent(process.env.DB_PASSWORD);
const uri = process.env.DB_URI_KEY;

// Connect to the MongoDB database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Define the Mongoose schema and model
const imageSchema = new mongoose.Schema({
    url: String,
    submitter: String
});
const Image = mongoose.model('Image', imageSchema);

// add url and submitter vars to mongoDB on post req
app.post('/submit', (req, res) => {
    // Save the data to the MongoDB database
    const newImage = new Image({
        url: req.body.url,
        submitter: req.body.submitter
    });
    newImage.save((err, newImage) => {
        if (err) return console.error(err);
        console.log(`url ${newImage.url} by ${newImage.submitter} received successfully`);
        res.render('success');
    });
});

// return random image url on get req
app.get('/new-image', async (req, res) => {
    const randomImage = await Image.aggregate([{ $sample: {size: 1} }]).exec();
    const randomUrl = randomImage[0].url;
    const randomSubmitter = randomImage[0].submitter;
    res.render('index', { randomUrl, randomSubmitter });
})