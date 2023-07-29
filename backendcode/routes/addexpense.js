const express = require('express');
const routes = express.Router();
const add = require('../controller/add');
const userAuthentication = require('../middleware/auth');

//when we make an post request url along with in headers we are passing token
//backend will recieves token and in the middleware we are dcrypting the token so we will get userId
//from the userId you will comes to know that who is logged in
//when we are adding the expenses what we have to do means in expense.create method just add the userId:req.user.id that's it 

routes.post("/add-expense",userAuthentication.authenticate,add.addexpense);

//when we make an get request url along with in headers we are passing token
//backend will recieves token and in the middleware we are dcrypting the token so we will get userId
//from the userId backend will comes to know that who's loggedin and backend get the respective user's add expense
//it send this add expense as a respond back to the client

//when we make an get request first server will go to middleware i.e userAuthentication.authenticate
//in order to go next method i.e add.getexpense we need to use next in middleware otherwise server will go directly to catch block in middleware
//then server will go to add.getexpense
routes.get("/get-expense",userAuthentication.authenticate,add.getexpense);

routes.delete("/delete-expense/:id",userAuthentication.authenticate,add.deleteexpense);
//when we make an delete request url along with in headers we are passing token
//backend will recieved token and in the middleware we are dcrypting the token so we will get userId
//in expense.destroy where we also pass userId:req.user.id
//i cannot delete others added expenses in the app,they also not able to delete my added expenses
//if u want to check this means expense.finAll() keep it like this only so we can get all added expenses

//routes.delete("/edit-expense/:id",add.editexpense);

module.exports = routes;