const express =require('express');
const app =express();
const bodyParser = require('body-parser');
const connection = require('./database/connection');
const session = require('express-session');

const articleController = require('./articles/articleController');
const usersController = require('./user/usersController');
const categoriesController = require('./categories/categoriesController');

const CategoriesModel = require('./categories/CategoriesModel');
const ArticleModel = require('./articles/ArticleModel');


//View engine
app.set('view engine','ejs');
//Static
app.use(express.static('public'));

//BodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Database
connection.authenticate().then(()=>{
    console.log('Conexão feita com sucesso!');
});

//Session
app.use(session({
    secret:'qualquercoisa',cookie:{maxAge:4000000}
}));

//Routers
app.use('/', articleController);
app.use('/', categoriesController);
app.use('/', usersController);

app.get('/',(req,res)=>{
    ArticleModel.findAll({limit:4,order:[['id','asc']]}).then(articles=>{
        CategoriesModel.findAll().then(categories=>{
            res.render('index',{
                articles:articles,
                categories:categories
            });
        });
    });
});

app.get('/:slug',(req,res)=>{
    var slug=req.params.slug
    ArticleModel.findOne({where:{slug:slug}}).then(article=>{
        if(article!=undefined){
            CategoriesModel.findAll().then(categories=>{
                res.render('article',{
                    article:article,
                    categories:categories
                });
            });
        }else{
            res.redirect('/');
        };
    });
});

app.listen(8080,()=>{
    console.log('servidor iniciado');
});