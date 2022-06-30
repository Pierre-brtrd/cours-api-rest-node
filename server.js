'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var apiRouter = require('./api-router').router;

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// Body parser configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

// Route configuration
app.get('/', (req, res) => {
    res.render('index', {
        subject: 'Application APIRest Node',
        name: 'Page d\'accueil',
        link: 'https://google.com',
    })
});

// Utilisation du routeur API
app.use('/api/', apiRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);