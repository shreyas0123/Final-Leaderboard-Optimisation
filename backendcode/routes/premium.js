const express = require('express');
const routes = express.Router();
const add = require('../controller/premium-membership');
const userAuthentication = require('../middleware/auth');

routes.get('/leaderboard',userAuthentication.authenticate,add.premiumFeature);

module.exports = routes;