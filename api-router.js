// Imports
var express = require('express');
var userCtrl = require('./Routes/usersController');
var messageCtrl = require('./Routes/messageController');

// Router
exports.router = (() => {
    const apiRouter = express.Router();

    // User Router
    apiRouter.route('/users/register/').post(userCtrl.register);
    apiRouter.route('/users/login/').post(userCtrl.login);
    apiRouter.route('/users/profil/').get(userCtrl.getUserProfile);
    apiRouter.route('/users/profil/').put(userCtrl.updateUserProfile);

    // Message Router
    apiRouter.route('/messages/new/').post(messageCtrl.createMessage);
    apiRouter.route('/messages/').get(messageCtrl.listMessages);

    return apiRouter;
})();