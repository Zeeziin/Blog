const sequelize = require('sequelize');
const connection = new sequelize('guiapress','root','CKWWwtmcy*b8@hU',{
    host:'localhost',
    dialect:'mysql'
});
module.exports=connection;