var Post = require("../models/post");
var Comment = require("../models/comment");

var mid = {};

mid.checkAuth = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","Please Login");
        return res.redirect("/login");
    }
    Post.findById(req.params.id, function(err,p){
        if(err){
            req.flash("error","Post ID not found");
            res.redirect("/posts");
        }
        else {
            if(p && p.author.id && p.author.id.equals(req.user._id))
             next();
            else {
                req.flash("error","That isn't your post");
                res.redirect("/posts");
            }
        }    
    });
}

mid.checkComm = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","Please Login");
        return res.redirect("back");
    }
    Comment.findById(req.params.comm_id, function(err,comm){
        if(err)res.redirect("back");
        else {
            if(comm.author.id.equals(req.user._id))
             next();
            else res.redirect("back");
        }    
    });
}

mid.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated())return next();
    req.flash("error", "Please Login"); //key, value passed into req on login page
    res.redirect('/login');
}

module.exports = mid;