const sequelize = require('sequelize');
const connection = new sequelize('guiapress','root','sua senha do mysql',{
    host:'localhost',
    dialect:'mysql'
});
module.exports=connection;
