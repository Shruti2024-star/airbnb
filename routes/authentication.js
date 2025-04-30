const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");

const User=require("../models/authenticate.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const listingController=require("../controller/authentication.js");

router
.route("/signUp")
.get(listingController.renderSignUp)
.post(wrapAsync(listingController.signUp));

router
.route("/login")
.get(listingController.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    listingController.login
);


router.get("/logout",listingController.logout);
module.exports=router;