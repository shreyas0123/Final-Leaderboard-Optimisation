const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const orderDb = sequelize.define("orderlist",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    paymentId:Sequelize.STRING,//paymentID u will get when u you make an payment till that time its null
    orderId:Sequelize.STRING, //orderId u get from razorpay initially because backend intern connected to the razorpay
    status:Sequelize.STRING //staus was in pending state initially when you login and clicked on Byu premium button go to orderlist table you can see that staus: pending,paymentId: null

})

async function createorderTable(){
    try{
        const data = await orderDb.sync() //{force:true}
        console.log('table called order created successfully on database table');
    }catch(error){
        console.log('error while creating users table on database table',error);
    }
}

createorderTable();

module.exports=orderDb