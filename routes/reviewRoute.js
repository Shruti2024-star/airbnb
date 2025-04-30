const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils//ExpressError");
const{listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview}=require("../middleware.js");
const {isLoggedIn,isOwner,validateListing,isAuthor}=require("../middleware.js");
const listingController=require("../controller/review.js");

router.post("/",isLoggedIn,validateReview,wrapAsync(listingController.createReview));
router.delete("/:review_id",isLoggedIn,isAuthor,wrapAsync(listingController.destroyReview));
module.exports=router;