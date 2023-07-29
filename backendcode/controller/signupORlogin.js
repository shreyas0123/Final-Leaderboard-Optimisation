const signUpUserDetails = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//for eg if we keep email column in form as blank and if i submit data will not be added to the database table (remove required text from signup.html page then only it works)
/*
function isstringvalid(string){
    if(string === undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
} */

//Sign Up page:
exports.signup = async (req,res,next) =>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        console.log('from req.body>>>',name,email,password);

        /*
        if(isstringvalid(name) || isstringvalid(email) || isstringvalid(password)){
            return res.status(400).json({success:false,message:'please fill all the details of the form'});
        } */
        //for eg if we keep email column in form as blank and if i submit data will not be added to the database table (remove required text from signup.html page then only it works)
        if(name ==="" || email ==="" || password === ""){
            return res.status(400).json({success:false,message:"please fill all the details of the form"});
        }

        //when executing this code, it will search the signUpUserDetails table for any records where the email column matches the email value you provided.
        //The result, stored in the uniqueEmail variable, will be an array of objects representing the matching user details.
        //You can then check the length of the uniqueEmail array to determine if a user with the provided email already exists in the database.
        //If the length is not zero, it indicates that there is a matching record, meaning the email is already taken.

        //if user trying to add existing mail id sending error from backend
        const uniqueEmail = await signUpUserDetails.findAll({where:{email:email}});
        //it will find wheather the entered mail id matches with existing mail id
        if(uniqueEmail.length !== 0){
            //if email id matches we comes to know that 
            return res.status(500).json({success:false,message:'user already exist,change the Email'})
        }
        /* 
        else if(uniqueEmail.length === 0){
        const data = await signUpUserDetails.create({
            name:name,
            email:email,
            password:password
        });
        
        
        res.json({success:true,message:'Signup succesfull,login to enter a page'});
        }
        */

        //Your users's password is at risk!!! :
        //here we are taking password,adding salt to it and then we are doing password encription using "blowfish algorithm"
        //so that we will get different different hash value eventhough userA,userB password are same
        //these hash value we will be storing in database as password
        const saltrounds = 10; //by defautl value of saltroud will be 10
        //This line defines the number of salt rounds to be used during the password hashing process.
        //The higher the number, the more secure the hash will be, but it will also take longer to compute.
        bcrypt.hash(password, saltrounds, async (err,hash) =>{
            console.log(err);

            const data = await signUpUserDetails.create({
            name:name,
            email:email,
            password:hash
        });
        
        })

        
        res.json({success:true,message:'Signup succesfull,login to enter a page'});
    }catch(error){
        console.log('error from adduserdb',error);
        res.json({success:false,message:'user already exist..please signup with new email'});
    }
}

//wrtiting function to create an token,jwt.sign takes two parameters i.e payload as userId:id & secret key 'fiuhf2bd484fdfhfff656ffhfEwddfkmnv'
//this secret we should not share with anyone if we are in actual production,not even push to git also.
//this secret key only we need to use in dcrypt
//secret key anything you can give

//used do decode jwt token (how to decode jwt token in front end)
//here we are fixing bug i.e is if user purchased premium membership then if i refresh the page or premium purchased user loggedin again 
//then "Premium Purchased" text will goes off and Buy premium button will showned again this is the bug we need to fix it
//once user purchased premium then if he loggedin again or refreshes the page always show him msg Pemium Purchased instead of Buy premium button

//while creating token along with pass ispremiumUser then pass these token to front end , in front end we will decrypt the token
//so that we comes to know which user purchased premium

function generateToken(id,ispremiumUser){
    return jwt.sign({userId: id,isPremium: ispremiumUser},'fiuhf2bd484fdfhfff656ffhfEwddfkmnv');
}

//login page
exports.login = async (req,res) =>{
    try{

        const email = req.body.email;
        const password = req.body.password;

        if(email.length === "" || password.length === ""){
            return res.status(400).json({success:false,message:'email or password is missing'})
        }
        //find wheather entered email matches with existing email in database
        //matched email is stored in uniqEmail
        //then compare matched email password from databse with entered password
        //if matches then user logged in succesfully
        //if password does not match then incorrect password
        //if email length ===0 then user does not exist
        const uniqEmail = await signUpUserDetails.findAll({where:{email:email}})
        console.log('uniqEmail',uniqEmail);
        if(uniqEmail.length !== 0){
            //The bcrypt.compare function is used to compare the password entered by the user (in plain text) in form fields
            //with the hashed password retrieved from the database.
            bcrypt.compare(password,uniqEmail[0].password, (err,result)=>{
                if(err){
                    throw new error('something went wrong');
                }
                if(result === true){
                    return res.status(200).json({success:true,message:'user loggedin succesfully', token:generateToken(uniqEmail[0].id,uniqEmail[0].ispremiumUser)}) 
                    //when user try to login by entering mail id ,password 
                    //then backend will verify that wheather entered  mail id, password is corrrect or not 
                    //if correct then login was succesfull then backend will create token specific to that user 
                    //backend will generate token 
                }else{
                    return res.status(400).json({success:false,message:'incorrect password'})
                }
            })
                
            
        }else{
            return res.status(400).json({success:false,message:'user does not exist'})
        }
    }catch(error){
        console.log('error from login page',error);
    }
}