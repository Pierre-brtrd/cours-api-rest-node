'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*const express = require('express')
const app = express()
const parkings = require('./parkings.json');
const reservations = require('./reservation.json');

// Middleware
app.use(express.json());

// Récupère tous les parkings
app.get('/parkings', (req, res) => {
    res.status(200).json(parkings)
})

// Récupère 1 parking par son id
app.get('/parkings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const parking = parkings.find(parking => parking.id === id);
    res.status(200).json(parking);
})

// Créer un parking
app.post('/parkings', (req, res) => {
    parkings.push(req.body);
    res.status(200).json(parkings);
})

// Modifier un parkings
app.put('/parkings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let parking = parkings.find(parking => parking.id === id);
    parking.name = req.body.name;
    parking.city = req.body.city;
    parking.type = req.body.type;
    res.status(200).json(parkings);
})

// Supprimer un parking
app.delete('/parkings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let parking = parkings.find(parking => parking.id === id);
    parkings.splice(parkings.indexOf(parking), 1);
    res.status(200).json(parkings);
})


// Récupère toutes les réservation d'un parking
app.get('/parkings/:id/reservations', (req, res) => {
    const id = parseInt(req.params.id);
    let reservationsPark = reservations.filter(reservation => reservation.parkingId === id);
    res.status(200).json(reservationsPark);
})

// Créer une réservation pour un parking
app.post('/parkings/reservations', (req, res) => {
    reservations.push(req.body);
    res.status(200).json(reservations);
})

// Modifier une réservation
app.put('/parkings/reservations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let reservation = reservations.find(reservation => reservation.id === id);
    reservation.parking = req.body.parking;
    reservation.parkingId = req.body.parkingId;
    reservation.city = req.body.city;
    reservation.clientName = req.body.clientName;
    reservation.vehicle = req.body.vehicle;
    reservation.licensePlate = req.body.licensePlate;
    reservation.checkin = req.body.checkin;
    reservation.checkout = req.body.checkout;
    res.status(200).json(reservations);
})

// Supprime une réservation
app.delete('/parkings/reservations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let reservation = reservations.find(reservation => reservation.id === id);
    reservations.splice(reservations.indexOf(reservation), 1);
    res.status(200).json(reservations);
})

// Lance le serveur en écoute port 8080
app.listen(8080, () => {
    console.log('Serveur à l\'écoute');
})*/