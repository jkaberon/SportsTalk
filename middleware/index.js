var Campground = require("../models/campground");
var Comment = require("../models/comment");

var mid = {};

mid.checkAuth = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("error","Please Login");
        return res.redirect("/login");
    }
    Campground.findById(req.params.id, function(err,cg){
        if(err){
            req.flash("error","Campground ID not found");
            res.redirect("/campgrounds");
        }
        else {
            //console.log(cg.author.id);
            //console.log(req.user._id);
            if(cg && cg.author.id && cg.author.id.equals(req.user._id))
             //res.render("campgrounds/edit",{campground:cg});
             next();
            else {
                req.flash("error","That isn't your campground");
                res.redirect("/campgrounds");
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
            //console.log(cg.author.id);
            //console.log(req.user._id);
            if(comm.author.id.equals(req.user._id))
             //res.render("campgrounds/edit",{campground:cg});
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