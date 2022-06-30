// Imports
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../Utils/jwt.utils');

// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

// Routes
module.exports = {
    createMessage: (req, res) => {
        console.log(req);
        // Geting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var title = req.body.title;
        var content = req.body.content;
        let categoryId = req.body.categoryId;

        console.log(req.body);
        if (title == null || content == null) {
            return res.status(400).json({
                'error': 'Missing parameters'
            });
        }

        if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
            return res.status(400).json({
                'error': 'Invalid parameters'
            });
        }

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: {
                        id: userId
                    }
                }).then((userFound) => {
                    done(null, userFound);
                }).catch((error) => {
                    return res.status(500).json({
                        'error': 'Unable to verify user'
                    });
                })
            },
            (userFound, done) => {
                if (userFound) {
                    models.Message.create({
                        title: title,
                        content: content,
                        likes: 0,
                        UserId: userFound.id,
                        CategoryId: categoryId
                    }).then((newMessage) => {
                        done(newMessage);
                    });
                } else {
                    return res.status(404).json({
                        'error': 'User not found'
                    });
                }
            },
        ], (newMessage) => {
            if (newMessage) {
                return res.status(200).json(newMessage);
            } else {
                return res.status(500).json({
                    'error': 'Cannot post message'
                });
            }
        });
    },
    listMessages: (req, res) => {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(', ') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [
                {
                    association: 'user',
                    attributes: ['username'],
                },
                {
                    model: models.Category,
                    attributes: ['nom']
                }
            ]
        }).then((messages) => {
            if (messages) {
                return res.status(200).json(messages);
            } else {
                return res.status(404).json({
                    'error': 'No messages found'
                });
            }
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                'error': 'Invalid fields',
                "message": err
            });
        })
    }
}