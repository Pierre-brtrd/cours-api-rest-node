'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./api-router').router;

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// Body parser configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Configuration Route
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send("<h1>Bienvenue son mon serveur API Node");
});

// Utilisation du routeur API
app.use('/api/', apiRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);