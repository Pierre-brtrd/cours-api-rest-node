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
    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        subject: 'Se connecter - Application APIRest Node',
        heading: 'Se connecter',
    });
});

app.get('/profil', (req, res) => {
    res.render('profil', {
        subject: 'Profil - Application APIRest Node',
        heading: 'Votre profil',
    });
});

app.get('/liste-messages', (req, res) => {
    res.render('messages', {
        subject: 'Message - Application APIRest Node',
        heading: 'Liste des messages'
    });
});

app.get('/create-category', (req, res) => {
    res.render('create-category', {
        subject: 'Créer catégorie - Application APIRest Node',
        heading: 'Création de catégorie'
    });
});
app.get('/create-message', (req, res) => {
    res.render('create-message', {
        subject: 'Créer message - Application APIRest Node',
        heading: 'Création de message'
    });
});

// Utilisation du routeur API
app.use('/api/', apiRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);