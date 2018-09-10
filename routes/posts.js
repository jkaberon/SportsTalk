var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var mid = require("../middleware");
var Comment = require("../models/comment");
var User = require("../models/user"),
    passport = require("passport");


//INDEX - display list
router.get("/posts",function(req,res){
    //res.render("posts",{posts:posts});
    //get all posts from db
    Post.find({},function(err,posts){
        if(err)console.log(err);
        else res.render("posts/index",{posts:posts});
    });
});

//CREATE - new posts to db
router.post("/posts",mid.isLoggedIn,function(req,res){
    //post post to db
    //redirect back to posts page
    var title=req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    //posts.push({name:name,image:image});
    Post.create({title:title,image:image,description:desc},function(err,p){
        if(err)console.log(err);
        p.author.id = req.user._id;
        p.author.username = req.user.username;
        p.save();
    });
    res.redirect("/posts");
});

//NEW - form to make new post
router.get("/posts/new",mid.isLoggedIn,function(req,res){
   res.render("posts/new"); 
});

//populate() - load data into field from Id
//SHOW - show extra info about 1 item
router.get("/posts/:id", function(req,res){
   //find p w/ provided ID
   Post.findById(req.params.id).populate("comments").exec(function(err,p_found){
       if(err){
           //console.log(err);
           req.flash("error","Post ID not found");
           res.redirect("/posts");
       }
       else res.render("posts/show",{post:p_found});
   });
   //show more info about p
});

// post.findById("5b35485c75c54711f0cb8cdd",function(err,p){
//     if(err)console.log(err);
//     else p.image = "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-post-background.jpg";
//     p.save();
// });

//EDIT
router.get("/posts/:id/edit", mid.checkAuth, function(req,res){
    Post.findById(req.params.id,function(err,p){
        if(err){
            req.flash("error",err.message);
            res.redirect("/posts");
        }
        res.render("posts/edit",{post:p});
    });
});

//update
router.put("/posts/:id", mid.checkAuth, function(req,res){
    Post.findByIdAndUpdate(req.params.id,req.body.p,function(err,p){
        if(err){
            req.flash("error",err.message);
            res.redirect("/posts");
        }
        else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/posts/:id", mid.checkAuth, function(req,res){
   Post.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error",err.message);
       }
       res.redirect("/posts");
   }); 
});

module.exports = router;