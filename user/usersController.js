const express = require('express');
const router = express.Router();
const UserModel = require('./UserModel');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const adminAuth = require('../middlewares/adminAuth');
const CategoriesModel = require('../categories/CategoriesModel');

router.get('/admin/users',adminAuth,(req,res)=>{
    UserModel.findAll().then(users=>{
        res.render('admin/users/index', {
            users:users
        });
    });
});

router.get('/users/create',(req,res)=>{
    CategoriesModel.findAll().then(categories=>{
        res.render('admin/users/create',{
            categories:categories
        });
    });
});

router.post('/users/create',(req,res)=>{
    var nick = req.body.name
    var email = req.body.email
    var password = req.body.password

    UserModel.findOne({where:{email:email}}).then(user=>{
        if(user==undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            UserModel.create({
                name:nick,
                email:email,
                password:hash
            }).then(()=>{
                res.redirect('/admin/users');
            });
        }else{
            res.redirect('/admin/users/create');
        };
    });
});

router.get('/admin/users/edit/:id',adminAuth,(req,res)=>{
    var id = req.params.id
    UserModel.findByPk(id).then(user=>{
        res.render('admin/users/edit',{
            user:user
        });
    });
});

router.post('/users/saveedit',adminAuth,(req,res)=>{
    var id = req.body.id
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    UserModel.findOne({where:{email:email}}).then(user=>{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        UserModel.update({name:name,email:email,password:hash},{where:{id:id}}).then(()=>{
            res.redirect('/admin/users');
        });
    });
});

router.post('/admin/users/delete',adminAuth,(req,res)=>{
    var id = req.body.id
    UserModel.destroy({where:{id:id}}).then(()=>{
        res.redirect('/admin/users');
    });
});

router.get('/login',(req,res)=>{
    res.render('admin/users/login');
});

router.post('/authenticate',(req,res)=>{
    var email = req.body.email
    var password = req.body.password
    UserModel.findOne({where:{email:email}}).then(user=>{
        if(user!=undefined){
            var correct = bcrypt.compareSync(password, user.password);
            if(correct){
                req.session.user = {
                    id:user.id,
                    email:user.email,
                }
                res.redirect('/admin/articles');
            }else{
                res.redirect('/login');
            };
        }else{
            res.redirect('/login');
        };
    });
});

router.get('/logout',(req,res)=>{
    req.session.user = undefined
    res.redirect('/');
})
module.exports=router;