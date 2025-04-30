const express=require("express");
const router=express.Router();
const multer  = require('multer');


const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controller/listing.js");
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});


router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/search",wrapAsync(listingController.searchPlaces));

router
.route("/:id")
.put(
    isLoggedIn,
    upload.single("listing[image]"),
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing

))
.get(wrapAsync(listingController.showListing))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing
));



router.get("/icon/:category",wrapAsync(listingController.showCategory));


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;




