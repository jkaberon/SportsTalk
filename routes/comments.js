var express = require("express");
var router = express.Router();
var post = require("../models/post");
var Comment = require("../models/comment");
var mid = require("../middleware");
var User = require("../models/user"),
    passport = require("passport");

//NEW
router.get("/posts/:id/comments/new",mid.isLoggedIn,function(req,res){
    post.findById(req.params.id, function(err,p){
        if(err)console.log(err);
        else res.render("comments/new",{post:p});
    });
});

//CREATE
router.post("/posts/:id", function(req,res){
   //lookup post using ID
   post.findById(req.params.id, function(err,p){
       if(err){
           req.flash("error",err.message);
           res.redirect("/posts");
       }
       else Comment.create(req.body.comment, function(err,comm){
           if(err)console.log(err);
           else {
               comm.author.id = req.user._id;
               comm.author.username = req.user.username;
               comm.save();
               p.comments.push(comm);
               p.save();
               req.flash("success","Successfully created comment");
               res.redirect("/posts/"+p._id);
           }
       });
       //console.log(req.body.comment);
   });
   //create comment
   //connect new comment to post
   //redirect post show page
   
});

//EDIT
router.get("/posts/:id/comments/:comm_id/edit", mid.checkComm, function(req,res){
    Comment.findById(req.params.comm_id, function(err1,comm){
            if(err1)console.log(err1);
            else res.render("comments/edit",{p_id:req.params.id,comment:comm});
    });
});

//UPDATE
router.put("/posts/:id/:comm_id", mid.checkComm, function(req,res){
    Comment.findByIdAndUpdate(req.params.comm_id,req.body.comment,function(err,up_com){
        if(err)res.redirect("back");
        else res.redirect("/posts/"+req.params.id);
    });
});

//DESTROY
router.delete("/posts/:id/:comm_id", mid.checkComm, function(req,res){
   Comment.findByIdAndRemove(req.params.comm_id, function(err){
       if(err){
           req.flash("error",err.message);
           res.redirect("back");
       }
       else {
           req.flash("success","Comment deleted");
           res.redirect("/posts/"+req.params.id);
       }
   }); 
});

module.exports = router;