var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var mid = require("../middleware");
var User = require("../models/user"),
    passport = require("passport");

//NEW
router.get("/campgrounds/:id/comments/new",mid.isLoggedIn,function(req,res){
    Campground.findById(req.params.id, function(err,cg){
        if(err)console.log(err);
        else res.render("comments/new",{campground:cg});
    });
});

//CREATE
router.post("/campgrounds/:id", function(req,res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err,cg){
       if(err){
           req.flash("error",err.message);
           res.redirect("/campgrounds");
       }
       else Comment.create(req.body.comment, function(err,comm){
           if(err)console.log(err);
           else {
               comm.author.id = req.user._id;
               comm.author.username = req.user.username;
               comm.save();
               cg.comments.push(comm);
               cg.save();
               req.flash("success","Successfully created comment");
               res.redirect("/campgrounds/"+cg._id);
           }
       });
       //console.log(req.body.comment);
   });
   //create comment
   //connect new comment to campground
   //redirect campground show page
   
});

//EDIT
router.get("/campgrounds/:id/comments/:comm_id/edit", mid.checkComm, function(req,res){
    Comment.findById(req.params.comm_id, function(err1,comm){
            if(err1)console.log(err1);
            else res.render("comments/edit",{cg_id:req.params.id,comment:comm});
    });
});

//UPDATE
router.put("/campgrounds/:id/:comm_id", mid.checkComm, function(req,res){
    Comment.findByIdAndUpdate(req.params.comm_id,req.body.comment,function(err,up_com){
        if(err)res.redirect("back");
        else res.redirect("/campgrounds/"+req.params.id);
    });
});

//DESTROY
router.delete("/campgrounds/:id/:comm_id", mid.checkComm, function(req,res){
   Comment.findByIdAndRemove(req.params.comm_id, function(err){
       if(err){
           req.flash("error",err.message);
           res.redirect("back");
       }
       else {
           req.flash("success","Comment deleted");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }); 
});

module.exports = router;