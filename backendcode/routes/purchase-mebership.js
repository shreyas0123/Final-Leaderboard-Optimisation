const express = require('express');
const routes = express.Router();
const add = require('../controller/purchase-membership');
const userAuthentication = require('../middleware/auth');

routes.get('/premium-membership',userAuthentication.authenticate,add.getPremium);

routes.post('/updateTransactionStaus',userAuthentication.authenticate,add.updatePremium);

module.exports = routes;