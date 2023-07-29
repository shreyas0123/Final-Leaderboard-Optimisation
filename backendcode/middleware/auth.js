const jwt = require('jsonwebtoken');
const User = require('../models/signup');

exports.authenticate = async(req,res,next) =>{
    try{
        //from req.header where in authorization we take token
        const token  = req.header('Authorization');
        console.log('token from middleware',token);
        //we dcrypt the token by passing token,secret key that we used during loggin (function generatekey)
        const user = jwt.verify(token,'fiuhf2bd484fdfhfff656ffhfEwddfkmnv');
        console.log('userId >>>>>',user.userId);
        //it is used to retrieve the user data from the User model based on the user ID (user.userId).
        //User.findByPk used to find wheather user exist or not
        const data = await User.findByPk(user.userId);
        //console.log('data from findByPk',data)
        
        //req is an global object common in(async (req,res) in both exports.authenticate(middleware folder),exports.getexpense(add.js controller folder))
        //so in addexpense routes we can say req is common in both userAuthentication.authenticate,add.getexpense
        //hence we add user(has userId) to req so req.user is an global object
        //we pass existing userId to from 'data' to 'req.user'
        //so that we we go to next method in routes folder i.e add.addexpense where req.user will be available for further process
        req.user = data; //if id:1 in users table in database it will return me entire user details where id=1
        //console.log('req.user>>>',req.user)
        //we are basically retrieving the userId const data then attaching that userId to req.user
        next(); //it is explained in getexpense route folder

    }catch(error){
        console.log('error in auth.js in middleware',error);
        res.json({Error:error});
    }
}