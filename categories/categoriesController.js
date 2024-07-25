const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CategoriesModel = require('./CategoriesModel');
const ArticleModel = require('../articles/ArticleModel');
const slugify = require('slugify');
const Article = require('../articles/ArticleModel');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories',adminAuth,(req,res)=>{
    CategoriesModel.findAll({order:[['id', 'DESC']]}).then(categories=>{
        res.render('admin/categories/index',{
            categories:categories
        });
    });
});

router.get('/admin/categories/new',adminAuth,(req,res)=>{
    res.render('admin/categories/new');
});

router.post('/categories/save',adminAuth,(req,res)=>{
    var title=req.body.title
    CategoriesModel.create({
        title:title,
        slug:slugify(title)
    }).then(()=>{
        res.redirect('/admin/categories');
    });
});

router.get('/admin/categories/edit/:id',adminAuth,(req,res)=>{
    var id=req.params.id
    CategoriesModel.findByPk(id).then(category=>{
        res.render('admin/categories/edit',{
            category:category
        });
    });
});

router.post('/categories/saveedit',adminAuth,(req,res)=>{
    var title=req.body.title
    var id=req.body.id
    CategoriesModel.update({title:title, slug:slugify(title)},{where:{id:id}}).then(()=>{
        res.redirect('/admin/categories');
    });
});

router.post('/admin/categories/delete',adminAuth,(req,res)=>{
    var id=req.body.id
    CategoriesModel.destroy({where:{id:id}}).then(()=>{
        res.redirect('/admin/categories');
    });
});

router.get('/category/:slug',(req,res)=>{
    var slug=req.params.slug
    CategoriesModel.findOne({where:{slug:slug},include:[{model:ArticleModel}]}).then(category=>{
        if(category!=undefined){
            CategoriesModel.findAll().then(categories=>{
                res.render('admin/categories/categories',{
                    articles:category.articles,
                    categories:categories
                })
            })
        }else{
            res.redirect('/');
        };
    });
});

module.exports=router;