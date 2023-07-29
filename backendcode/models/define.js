const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//sequelize method will automatically create table,column in database if does not exist
//create obj called user and table name of sequelizer is "expenses"

const alldetails = sequelize.define("expenses",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    expens:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    descript:{
        type:Sequelize.STRING,
        allowNull:false
    },
    categ:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

(async () =>{
    try{
        // Create the User table if it doesn't exist with force: true option
        await alldetails.sync() ////if table does not exist then force:true inside user.sync({force:true})
        console.log('expenses table created successfully');
    }
    catch(error){
        console.log('error while creating expenses table',error);
    }

})();

module.exports = alldetails;

