const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError");
const{listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        
        const listingShowPage = req.originalUrl.includes("/review") 
            ? `/listings/${req.params.id}` 
            : req.originalUrl;
            
        req.session.redirectUrl = listingShowPage;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","you have no permission on this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    let{id,review_id}=req.params;
    let review=await Review.findById(review_id)
 
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you have no permission on this review");
        return res.redirect(`/listings/${id}`);
    }
    next();

}