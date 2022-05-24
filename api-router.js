// Imports
const express = require('express');
const usesCtrl = require('./Routes/usersController');

// Router
exports.router = (() => {
    const apiRouter = express.Router();

    // User Router
    apiRouter.route('/users/register/').post(usesCtrl.register);
    apiRouter.route('/users/login/').post(usesCtrl.login);

    return apiRouter;
})();