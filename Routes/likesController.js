// Imports
var models = require('../models');
var jwtUtils = require('../Utils/jwt.utils');
var asyncLib = require('async');

// Routes
module.exports = {
    likePost: (req, res) => {
        // Geting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        console.log(userId);

        // Params
        var messageId = parseInt(req.params.messageId);

        if (messageId <= 0) {
            return res.status(400).json({
                'error': 'Invalid paramaters'
            });
        }

        asyncLib.waterfall([
            (done) => {
                models.Message.findOne({
                    where: {
                        id: messageId
                    }
                }).then((messageFound) => {
                    done(null, messageFound);
                }).catch((error) => {
                    return res.status(500).json({
                        'error': 'Unable to verify message'
                    });
                })
            },
            (messageFound, done) => {
                if (messageFound) {
                    models.User.findOne({
                        where: {
                            id: userId
                        }
                    }).then((userFound) => {
                        done(null, messageFound, userFound);
                    }).catch((error) => {
                        return res.status(500).json({
                            'error': 'Unable to verify user',
                            'message': error
                        });
                    })
                } else {
                    return res.status(404).json({
                        'error': 'Post already liked'
                    });
                }
            },
            (messageFound, userFound, done) => {
                if (userFound) {
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            messageId: messageId
                        }
                    }).then((isUserAlreadyLike) => {
                        done(null, messageFound, userFound, isUserAlreadyLike);
                    }).catch((error) => {
                        return res.status(500).json({
                            'error': 'Unable to verify if user already liked the post'
                        });
                    })
                } else {
                    return res.status(404).json({
                        'error': 'User not found'
                    });
                }
            },
            (messageFound, userFound, isUserAlreadyLike, done) => {
                if (!isUserAlreadyLike) {
                    messageFound.addUser(userFound)
                        .then((alreadyLikeFound) => {
                            done(null, messageFound, userFound, true);
                        }).catch((error) => {
                            return res.status(500).json({
                                'error': 'Unable to set reaction'
                            });
                        })
                } else {
                    isUserAlreadyLike.destroy()
                        .then(() => {
                            done(null, messageFound, userFound, false);
                        }).catch((error) => {
                            return res.status(500).json({
                                'error': 'Cannot remove liked'
                            });
                        })
                }
            },
            (messageFound, userFound, isUserAlreadyLike, done) => {
                if (isUserAlreadyLike) {
                    messageFound.update({
                        likes: messageFound.likes + 1,
                    }).then(() => {
                        done(messageFound);
                    }).catch((error) => {
                        console.log(error);
                        return res.status(500).json({
                            'error': 'Cannot update message like counter'
                        });
                    })
                } else {
                    messageFound.update({
                        likes: messageFound.likes - 1,
                    }).then(() => {
                        done(messageFound);
                    }).catch((error) => {
                        return res.status(500).json({
                            'error': 'Cannot update message like counter'
                        });
                    })
                }

            }
        ], (messageFound) => {
            return res.status(200).json(messageFound);
        });
    },
    dislikePost: (req, res) => {
        // Geting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var messageId = parseInt(req.params.messageId);

        if (messageId <= 0) {
            return res.status(400).json({
                'error': 'Invalid paramaters'
            });
        }

        asyncLib.waterfall([
            (done) => {
                models.Message.findOne({
                    where: {
                        id: messageId
                    }
                }).then((messageFound) => {
                    done(null, messageFound);
                }).catch((error) => {
                    return res.status(500).json({
                        'error': 'Unable to verify message'
                    });
                })
            },
            (messageFound, done) => {
                if (messageFound) {
                    models.User.findOne({
                        where: {
                            id: userId
                        }
                    }).then((userFound) => {
                        done(null, messageFound, userFound);
                    }).catch((error) => {
                        return res.status(500).json({
                            'error': 'Unable to verify user'
                        });
                    })
                } else {
                    return res.status(404).json({
                        'error': 'Post already liked'
                    });
                }
            },
            (messageFound, userFound, done) => {
                if (userFound) {
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            messageId: messageId
                        }
                    }).then((isUserAlreadyLike) => {
                        done(null, messageFound, userFound, isUserAlreadyLike);
                    }).catch((error) => {
                        return res.status(500).json({
                            'error': 'Unable to verify if user already liked the post'
                        });
                    })
                } else {
                    return res.status(404).json({
                        'error': 'User not found'
                    });
                }
            },
            (messageFound, userFound, isUserAlreadyLike, done) => {
                if (isUserAlreadyLike) {
                    isUserAlreadyLike.destroy()
                        .then(() => {
                            done(null, messageFound, userFound);
                        }).catch((error) => {
                            return res.status(500).json({
                                'error': 'Cannot remove liked'
                            });
                        })
                } else {
                    return res.status(409).json({
                        'error': 'message already disliked'
                    });
                }
            },
            (messageFound, userFound, done) => {
                messageFound.update({
                    likes: messageFound.likes - 1,
                }).then(() => {
                    done(messageFound);
                }).catch((error) => {
                    return res.status(500).json({
                        'error': 'Cannot update message like counter'
                    });
                })
            }
        ], (dislikedPost) => {
            if (dislikedPost) {
                return res.status(200).json(dislikedPost);
            } else {
                return res.status(500).json({
                    'error': 'Cannot update message'
                });
            }
        });
    }
}