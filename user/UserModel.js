const sequelize = require('sequelize');
const connection = require('../database/connection');
const UserModel = connection.define('users',{
    name:{
        type:sequelize.STRING,
        allowNull:false
    },
    email:{
        type:sequelize.STRING,
        allowNull:false
    },
    password:{
        type:sequelize.STRING,
        allowNull:false
    }
});
module.exports=UserModel;