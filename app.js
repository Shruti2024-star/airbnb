const express=require("express");
const app=express();
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/authenticate.js");

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();

}

const initData=require("./init/data.js");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
const Review=require("./models/review.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname, "public")));


app.use(express.urlencoded({extended:true}));


const ExpressError=require("./utils//ExpressError");


const methodOverride=require("method-override");
app.use(methodOverride('_method'));

const mongoose=require("mongoose");


// const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

const listings=require("./routes/list.js");
const reviews=require("./routes/reviewRoute.js")
const authentication=require("./routes/authentication.js");
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

  
async function main(){
    await mongoose.connect(dbUrl);
}

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session",err);
})
let sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
   
    }
}
  
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    res.locals.currentCategory = req.params.category || null;

    next();
})


app.use("/listings",listings)
app.use("/listings/:id/review", reviews);

app.use("/",authentication);

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("server listening at port 8080");
})