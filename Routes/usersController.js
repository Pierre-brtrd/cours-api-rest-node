// Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../Utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

// Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^[a-zA-Z]\w{3,14}$/;

// Routes
module.exports = {
    register: function (req, res) {
        // Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if (email == null || username == null || password == null) {
            return res.status(400).json({
                'error': 'Missing parameters'
            });
        }

        // Vérify length username
        if (username.length >= 16 || username.length <= 3) {
            return res.status(400).json({
                'error': 'Wrong Username (must be length 4 - 15)'
            });
        }

        // Verify email regex pattern
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({
                'error': 'Email is not valid'
            });
        }

        // Verify password
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                'error': 'Password invalid (must be - The password\'s first character must be a letter, it must contain at least 4 characters and no more than 15 characters and no characters other than letters, numbers and the underscore may be used )'
            });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                        attributes: ['email'],
                        where: {
                            email: email
                        }
                    })
                    .then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            'error': 'Unable to verify user'
                        });
                    })
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, (err, hashPassword) => {
                        done(null, userFound, hashPassword);
                    })
                } else {
                    return res.status(409).json({
                        'error': 'User already in base'
                    });
                }
            },
            function (userFound, hashPassword, done) {
                var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: hashPassword,
                        bio: bio,
                        isAdmin: 0
                    })
                    .then((newUser) => {
                        done(newUser);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            'error': 'Cannot add user'
                        });
                    })
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({
                    'error': 'Cannot add user'
                });
            }
        });
    },
    login: function (req, res) {
        // Params
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({
                'error': 'missing parameters'
            });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                        where: {
                            email: email
                        }
                    })
                    .then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            'error': 'Unable to verify user'
                        });
                    })
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, (errBycrypt, resBycript) => {
                        done(null, userFound, resBycript);
                    })
                } else {
                    return res.status(403).json({
                        'error': 'Invalids informations'
                    });
                }
            },
            function (userFound, resBycript, done) {
                if (resBycript) {
                    done(userFound);
                } else {
                    return res.status(403).json({
                        'error': 'Invalids informations'
                    });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(200).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({
                    'error': 'cannot log on user'
                });
            }
        });
    },
    getUserProfile: function (req, res) {
        // Geting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        console.log(headerAuth);
        console.log(userId);
        if (userId < 0) {
            return res.status(400).json({
                'error': 'Invalid authorization'
            });
        }

        models.User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where: {
                id: userId
            },
        }).then((user) => {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({
                    'error': 'User not found'
                });
            }
        }).catch((err) => {
            return res.status(500).json({
                'error': 'Cannot fetch User'
            });
        })
    },
    updateUserProfile: (req, res) => {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var bio = req.body.bio;

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                        attributes: ['id', 'bio'],
                        where: {
                            id: userId
                        },
                    }).then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            'error': 'Unable to verify User identity'
                        });
                    })
            },
            (userFound, done) => {
                if (userFound) {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio)
                    }).then(() => {
                        done(userFound);
                    }).catch((err) => {
                        return res.status(500).json({
                            'error': 'Cannot update User'
                        });
                    })
                }
            }
        ], (userFound) => {
            if (userFound) {
                return res.status(200).json(userFound);
            } else {
                return res.status(500).json({
                    'error': 'Cannot update User profile'
                });
            }
        })
    }
}