const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.createReview = async(req,res)=>{
    let {id}=req.params;
    let newReviewList=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    newReviewList.reviews.push(newReview);
    await newReview.save();
    await newReviewList.save();
    req.flash("success","New Review is Added");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyReview=async(req,res)=>{
    let {id,review_id}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}});
    let review=await Review.findByIdAndDelete(review_id);
    req.flash("success","Review is deleted");
    res.redirect(`/listings/${id}`);
  
}