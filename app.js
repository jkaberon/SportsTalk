var express = require("express");
var app = express();
var bp = require("body-parser");
var mongoose = require("mongoose"),
    flash = require("connect-flash"),
    post = require("./models/post"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override");
    
var commentRoutes = require("./routes/comments"),
    postRoutes = require("./routes/posts"),
    indexRoutes = require("./routes/index");

mongoose.connect(process.env.DATABASE_URL);
app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
//seedDb();

app.use(require("express-session")({
    secret: "whatever",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){ //pass req to all templates
    res.locals.req = req;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// post.create({
//      name:"salmon",image:"",
//      description: "SOmething something whatever"
// }, function(err,cg){
//     if(err)console.log(err);
//     else console.log(cg);
// });

//  var posts = [
       
//     ];

app.get("/",function(req,res){
    res.render("startpage");
});

app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpserver started");
    //console.log(process.env.DATABASE_URL);
});

//db.[collection].drop() to delete all items in db