// Imports
const bcrypt = require('bcrypt');
const jwtUtils = require('../Utils/jwt.utils');
const models = require('../models');

// Routes
module.exports = {
    register: function (req, res) {
        // Params
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const bio = req.body.bio;

        if (email == null || username == null || password == null) {
            return res.status(400).json({
                'error': 'Missing parameters'
            });
        }

        // TODO Verify variable pseudo length, mail regex, password

        models.User.findOne({
                attributes: ['email'],
                where: {
                    email: email
                }
            })
            .then(function (userFound) {
                if (!userFound) {
                    // User Verify
                    bcrypt.hash(password, 5, (err, hashPassword) => {
                        const newUser = models.User.create({
                                email: email,
                                username: username,
                                password: hashPassword,
                                bio: bio,
                                isAdmin: 0
                            })
                            .then((newUser) => {
                                return res.status(201).json({
                                    'userId': newUser.id
                                })
                            })
                            .catch((err) => {
                                return res.status(500).json({
                                    'error': 'Cannot add user'
                                });
                            });
                    });
                } else {
                    // Utilisateur already in base
                    return res.status(409).json({
                        'error': 'User already exists'
                    });
                }
            })
            .catch(function (err) {
                return res.status(500).json({
                    'error': 'Unable ti verify user'
                })
            });
    },
    login: function (req, res) {
        // Params
        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({
                'error': 'missing parameters'
            });
        }

        // TODO Verify mail regex, password length

        models.User.findOne({
                where: {
                    email: email
                }
            })
            .then((userFound) => {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, (errBycrypt, resBycript) => {
                        if (resBycript) {
                            return res.status(200).json({
                                'userId': userFound.id,
                                'token': jwtUtils.generateTokenForUser(userFound)
                            });
                        } else {
                            return res.status(403).json({
                                'error': 'Invalids informations'
                            });
                        }
                    })
                } else {
                    return res.status(403).json({
                        'error': 'Invalids informations'
                    });
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    'error': 'Unable to verify user'
                });
            });
    }
}