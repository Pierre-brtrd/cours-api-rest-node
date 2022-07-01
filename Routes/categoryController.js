// Imports
var jwtUtils = require('../Utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

// Constrants

// Exported
module.exports = {
    createTag: (req, res) => {
        // Getting auth header (token)
        let headerAuth = req.headers['authorization'];

        let userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0) {
            return res.status(403).json({ "error": "Invalid Token" });
        }

        // Params
        let nom = req.body.nom;

        if (nom.length < 3 || !nom) {
            return res.status(400).json({ "error": "Invalid Argument" });
        }

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: { id: userId }
                }).then((userFound) => {
                    done(null, userFound);
                }).catch((err) => {
                    return res.status(500).json({ "message": "Unable to find user", "error": err });
                })
            },
            (userFound, done) => {
                if (userFound) {
                    models.Category.findOne({
                        where: { nom: nom }
                    }).then((tagFound) => {
                        done(null, tagFound);
                    }).catch((err) => {
                        return res.status(500).json({ "message": "Unable to verify category", "err": err });
                    })
                } else {
                    return res.status(404).json({ "error": "User not found" });
                }
            },
            (tagFound, done) => {
                if (!tagFound) {
                    models.Category.create({
                        nom: nom
                    }).then((newTag) => {
                        done(newTag);
                    }).catch((err) => {
                        return res.status(500).json({ "message": "Unable to create tag", "error": err });
                    })
                } else {
                    return res.status(409).json({ "error": "Tag already exist" });
                }
            }
        ], (newTag) => {
            return res.status(200).json({ "tag": newTag });
        })
    },
    listTags: (req, res) => {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        models.Category.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(', ') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
        }).then((tags) => {
            if (tags) {
                return res.status(200).json(tags);
            } else {
                return res.status(404).json({
                    'error': 'No tags found'
                });
            }
        }).catch((err) => {
            return res.status(500).json({
                'error': 'Invalid fields',
                "message": err
            });
        });
    }
}