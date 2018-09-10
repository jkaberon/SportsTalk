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

app.use(require("express-session")({
    secret: process.env.SECRET,
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

app.get("/",function(req,res){
    res.render("startpage");
});

app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});