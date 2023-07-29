const Razorpay = require('razorpay');
const orderDb = require('../models/order');
const jwt = require('jsonwebtoken');

//after successful login click on Buy premium button then check the res getpremium where you can get order,key_id etc
//check the userlist databse table staus:pending,u will get orderId
//this menas when u click on Buy premium button razorpay will comes to know that okay someone is making an order 
//someone can be identified by razorpay using key_id,key_secret
//if payment successful then update status in userlist table from pending to success
//if payment unsuccessful then update the status in userlist from pending to failed

exports.getPremium = async (req, res, next) => {
    try {
        const Razor = new Razorpay({ //i have created new object called Razor and here my backend interns connect to the razorpay
            key_id: 'rzp_test_saG0Z18JgbQkTr', //using secret key id,key secret i have used .env because i have stored these secret inside .env folder
            //why i stored these secret in .env folder because i dont want to push these secret to git   
            key_secret: 'oh0QrxgMWerzQ2MHDUU8i6Eh'
            //from this screts id,key razorpay comes to know that okay this is shreyas comapny tries to create an order
        })

        const amount = 2000  //for creating an order i charge amount:20rs and currncy:INR
        //shreyas company tries to create an order with amount:20rs and currency:INR
        //if oder was successfull we will get orderId

        Razor.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error("Error while starting order")
            }
            //we need to store order in database(where payment not done because we are in the begining of the step)
            //in model create an table called order
            await orderDb.create(
                {
                    orderId: order.id,
                    status: "PENDING",
                    userId: req.user.id
                })
            res.json({ order, key_id: Razor.key_id }) //sending reponse to the fronend 
        })
    } catch (err) {
        console.log("Razor pay error", err)
        res.json({ Error: err })
    }
}

//when user click on buy premium button backend informs that this user trying create an order to the razorpay
//we create an order in razorpay dashboard as well once we create an order razorpay will send response as a unique orderId
//once we get orderId we save it on our own table
//then we send orderId to the frontend alog with key_id
//order is in pending state because in razorpay order just registered we are asking razorpay that can you open the razorpay frontend for payment?
//when i click on buy preimum button my front end needs to call razorpay fronend, we have to pass orderId to razorpay for doing payment from here razorpay will proceed forward

//when do login we are making get request to the orderlist table
//here my backend inntern connected to razorpay
//i have created new object called Razor
//using secret key id,key secret i have used .env because i have stored these secret inside .env folder
//why i stored these secret in .env folder because i dont want to push these secret to git 
//from this screts id,key razorpay comes to know that okay this is shreyas comapny tries to create an order
//check orderlist table where staus:pending,paymentId:null,only we get orderId and userId because while loggedin only we get orderId initially from razorpay
//i need to send response like order(it consist of orderid,amount etc) & key_id to the front end


//used do decode jwt token (how to decode jwt token in front end)
//here we are fixing bug i.e is if user purchased premium membership then if i refresh the page or premium purchased user loggedin again 
//then "Premium Purchased" text will goes off and Buy premium button will showned again this is the bug we need to fix it
//once user purchased premium then if he loggedin again or refreshes the page always show him msg Pemium Purchased instead of Buy premium button

//while creating token along with pass ispremiumUser then pass these token to front end , in front end we will decrypt the token
//so that we comes to know which user purchased premium
function generateToken(id,ispremiumUser){
    return jwt.sign({userId: id,isPremium: ispremiumUser},'fiuhf2bd484fdfhfff656ffhfEwddfkmnv');
}

exports.updatePremium = async (req, res, next) => {
    try {
        // Extract the payment ID and order ID from the request body.
        const paymentid = req.body.payment_id;
        const orderid = req.body.order_id;

        // Find the corresponding order in the database based on the order ID.
        const result = await orderDb.findOne({ where: { orderId: orderid } });

        // Check if the payment ID is null, indicating that the payment has failed.
        if (paymentid === null) {
            res.json({ message: "Payment is failed" });
            // Update the order status in the database to "FAILED".
            return result.update({ paymentId: paymentid, status: "FAILED" });
        }

        // If the payment ID is not null, it means the payment was successful.

        // Define a function to update the table with the payment status to "SUCCESS".
        function updateTable(result) {
            return new Promise((resolve) => {
                resolve(result.update({ paymentId: paymentid, status: "SUCCESS" }));
            });
        }

        // Define a function to update the user table to indicate that the user is a premium user.
        function updateUserTable() {
            return new Promise((resolve) => {
                resolve(req.user.update({ ispremiumUser: true }));
            });
        }

        // Execute both update functions concurrently using Promise.all(). //to speed up the code we can run these code parallelly
        Promise.all([updateTable(result), updateUserTable()]).then(() => {
            // If both updates are successful, send a response indicating a successful transaction.
            res.json({ success: true, message: "Premium Purchased Successfullly",token: generateToken(req.user.id,true)});
            //so we wre updating the old token because once user purchased premium membership if user refreshed the page 
            //then msg "Purchased Premium" msg will goes off and Buy premium button will appear
            //if user purchase premium thats why we used "true" here
        });
    } catch (err) {
        console.log("Error in updating transaction", err);
        // If an error occurs during the process, send an error response.
        res.json({ Error: err });
    }
};
