const express = require('express');
const router = express.Router();
const ArticleModel = require('./ArticleModel');
const slugify = require('slugify');
const CategoriesModel = require('../categories/CategoriesModel');
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles',adminAuth,(req,res)=>{
    ArticleModel.findAll({order:[['id','DESC']]}).then(articles=>{
        res.render('admin/articles/index',{
            articles:articles
        });
    });
});

router.get('/admin/articles/new',adminAuth,(req,res)=>{
    CategoriesModel.findAll().then(categories=>{
        res.render('admin/articles/new',{
            categories:categories
        });
    });
});

router.post('/articles/save',adminAuth,(req,res)=>{
    var title=req.body.title
    var body=req.body.body
    var categoryId=req.body.category
    ArticleModel.create({
        title:title,
        body:body,
        slug:slugify(title),
        categoryId:categoryId
    }).then(()=>{
        res.redirect('/admin/articles');
    });
});

router.get('/admin/articles/edit/:id',adminAuth,(req,res)=>{
    var id=req.params.id
    ArticleModel.findByPk(id).then(article=>{
        CategoriesModel.findAll().then(categories=>{
            res.render('admin/articles/edit',{
                article:article,
                categories:categories
            });
        });
    });
});

router.post('/articles/saveedit',adminAuth,(req,res)=>{
    var id=req.body.id
    var title=req.body.title
    var body=req.body.body
    var categodyId=req.body.category
    ArticleModel.update({title:title,slug:slugify(title), body:body, categoryId:categodyId},{where:{id:id}}).then(()=>{
        res.redirect('/admin/articles');
    });
});

router.post('/admin/articles/delete',adminAuth,(req,res)=>{
    var id=req.body.id
    ArticleModel.destroy({where:{id:id}}).then(()=>{
        res.redirect('/admin/articles');
    });
});

router.get('/articles/page/:num',(req,res)=>{
    var num=req.params.num
    offset=0
    if(isNaN(num)||num==1){
        offset=0
    }else{
        offset=(parseInt(num)-1)*4
    }
    ArticleModel.findAndCountAll({limit:4,offset:offset}).then(articles=>{
        var next;
        if(offset+4 > articles.count){
            next=false
        }else{
            next=true
        };
        var result={
            page:parseInt(num),
            next:next,
            articles:articles
        }
        CategoriesModel.findAll().then(categories=>{
            res.render('page',{
                page:parseInt(num),
                categories:categories,
                results:result
            });
        });
    });
});
module.exports=router;