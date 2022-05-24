// Imports
const express = require('express');
const userCtrl = require('./Routes/usersController');

// Router
exports.router = (() => {
    const apiRouter = express.Router();

    // User Router
    apiRouter.route('/users/register/').post(userCtrl.register);
    apiRouter.route('/users/login/').post(userCtrl.login);
    apiRouter.route('/users/profil/').get(userCtrl.getUserProfile);
    apiRouter.route('/users/profil/').put(userCtrl.updateUserProfile);

    return apiRouter;
})();