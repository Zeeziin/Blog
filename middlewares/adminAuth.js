function middleware(req,res,next){
    if(req.session.user==undefined){
        res.redirect('/login')
    }else{
        next()
    }
};
module.exports=middleware;