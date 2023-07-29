const User = require('../models/signup');
const Expense = require('../models/define');
const sequelize = require('../util/database');

exports.premiumFeature = async (req, res, next) => {
    try {
        // This is the main query that fetches data from the User model (users table) 
        //and includes associated data from the Expense model (expenses table).From this table how means we created association rules between User table and Expense table and we sets up an foreign key relation
        const leaderBoardofUser = await User.findAll({
            //Retreiving id,name from User table and defining aggregate function called "sum",for this we need to specify table and its column name here "expenses" table name, column name "expsne"
            //total_amount is the name given for sum value
            //include: we have used because for the aggregate function we need to specify on which table colum i need to perform aggregate

            order: [["totalExpense", "DESC"]]
        })
        res.json(leaderBoardofUser)
    } catch (err) {
        console.log('error in premiumFeature-->', err)
        res.json({ Error: err })
    }
}