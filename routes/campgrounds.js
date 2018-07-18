var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var mid = require("../middleware");
var Comment = require("../models/comment");
var User = require("../models/user"),
    passport = require("passport");


//INDEX - display list
router.get("/campgrounds",function(req,res){
    //res.render("campgrounds",{campgrounds:campgrounds});
    //get all cg from db
    Campground.find({},function(err,cgs){
        if(err)console.log(err);
        else res.render("campgrounds/index",{campgrounds:cgs});
    });
});

//CREATE - new campground to db
router.post("/campgrounds",mid.isLoggedIn,function(req,res){
    //get data from form and add to campgrounds array
    //redirect back to campgrounds page
    var name=req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //campgrounds.push({name:name,image:image});
    Campground.create({name:name,image:image,description:desc},function(err,cg){
        if(err)console.log(err);
        cg.author.id = req.user._id;
        cg.author.username = req.user.username;
        cg.save();
    });
    res.redirect("/campgrounds");
});

//NEW - form to make new campground
router.get("/campgrounds/new",mid.isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

//populate() - load data into field from Id
//SHOW - show extra info about 1 item
router.get("/campgrounds/:id", function(req,res){
   //find cg w/ provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err,cg_found){
       if(err){
           //console.log(err);
           req.flash("error","Campground ID not found");
           res.redirect("/campgrounds");
       }
       else res.render("campgrounds/show",{campground:cg_found});
   });
   //show more info about cg
});

// Campground.findById("5b35485c75c54711f0cb8cdd",function(err,cg){
//     if(err)console.log(err);
//     else cg.image = "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-campground-background.jpg";
//     cg.save();
// });

//EDIT
router.get("/campgrounds/:id/edit", mid.checkAuth, function(req,res){
    Campground.findById(req.params.id,function(err,cg){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit",{campground:cg});
    });
});

//update
router.put("/campgrounds/:id", mid.checkAuth, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.cg,function(err,cg){
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/campgrounds/:id", mid.checkAuth, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error",err.message);
       }
       res.redirect("/campgrounds");
   }); 
});

module.exports = router;