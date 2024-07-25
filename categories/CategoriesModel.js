const sequelize = require('sequelize');
const connection = require('../database/connection');
const Categories = connection.define('categories',{
    title:{
        type:sequelize.STRING,
        allowNull:false
    },
    slug:{
        type:sequelize.STRING,
        allowNull:false
    }
});
module.exports=Categories;