var express = require("express");
var router = express.Router();
var post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user"),
    passport = require("passport");


//AUTH ROUTES
router.get("/register", function(req,res){
    res.render('register');
});

//handle user signup
router.post('/register', function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            //res.send("User already exists");
            //console.log(err);
            req.flash("error",err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash("success","Welcome to SportsTalk");
            res.redirect("/posts");
        });
    });
});

//LOGIN routes
//render login form
router.get('/login', function(req,res){
    res.render("login", {message: req.flash("error")});
});

//authenticate is middleware - runs before callback
router.post('/login', passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function(req,res){
    req.logout();
    req.flash("success","Logout successful");
    res.redirect("/");
});

module.exports = router;