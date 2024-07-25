const sequelize = require('sequelize');
const connection = require('../database/connection');
const CategoriesModel = require('../categories/CategoriesModel');
const Article = connection.define('articles',{
    title:{
        type:sequelize.STRING,
        allowNull:false
    },
    body:{
        type:sequelize.TEXT,
        allowNull:false
    },
    slug:{
        type:sequelize.STRING,
        allowNull:false
    }
});
Article.belongsTo(CategoriesModel);
CategoriesModel.hasMany(Article);
module.exports=Article;