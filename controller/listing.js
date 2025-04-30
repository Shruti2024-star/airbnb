const Listing=require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient=mbxGeoCoding({accessToken:mapToken});

module.exports.index=async(req,res,next)=>{
 
    const allListings= await Listing.find({});
    res.render("listings.ejs",{allListings});
}
module.exports.renderNewForm= (req,res)=>{
    res.render("new.ejs")
} 

module.exports.searchPlaces=async(req,res)=>{
    const { searchedList } = req.query;
   

   const listings = await Listing.find({ 
    $or: [
      { title: { $regex: searchedList, $options: 'i' } },
      { location: { $regex: searchedList, $options: 'i' } }
    ]
  });
  if(listings.length > 0){
    res.render('searchResults.ejs', { listings, searchedList });
   
  }else{
    req.flash("error",`No results found for "${searchedList}"`);
    res.redirect("/listings");
  }


  
}
module.exports.renderEditForm=async(req,res,next)=>{
   
    let{id}=req.params;
   
    let editList=await Listing.findById(id);
    if(!editList){
        req.flash("error","Listing you requested does not exist ");
        return res.redirect("/listings");
    }
    let originalImageUrl=editList.image.url;
   
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,q_50");
    res.render("edit.ejs",{editList,originalImageUrl});
}
module.exports.updateListing= async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listings");
    }
    let {id}=req.params;

    listing=await Listing.findByIdAndUpdate(id,
        {...req.body.listing,
        
    });
    if(typeof req.file!== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={filename,url};
        await listing.save();

    }
   
    req.flash("success","Updated Successfully");
    res.redirect(`/listings/${id}`);
      
}
module.exports.showListing=async(req,res,next)=>{
   
    let {id}=req.params;
    
    const list=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },

    }).populate("owner");
   
    if(!list){
        req.flash("error","Listing you requested does not exist ");
        return res.redirect("/listings");
    }
    
    res.render("show.ejs",{list, mapToken: process.env.MAP_TOKEN});

}
module.exports.createListing= async(req,res,next)=>{
    

    let response=await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
     const newListing = new Listing({
    ...req.body.listing,
    });

   newListing.image = {
    filename: req.file.filename,
    url: req.file.path,
  };

   newListing.owner=req.user._id;
   newListing.geometry=response.body.features[0].geometry;
   
  
   
   await newListing.save();
   req.flash("success","New Listing is Added");
   res.redirect("/listings");
  

}
module.exports.destroyListing=async(req,res)=>{
  
    let{id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted");
    res.redirect("/listings");

}
module.exports.showCategory=async(req,res)=>{
    let{category}=req.params;
    
    const selectedListings = await Listing.find({ "category": category });
    
    if(selectedListings.length>0){
        res.render("showCategory.ejs",{selectedListings,currentCategory: category,});

    }else{
        req.flash("error","No Results Found");
        res.redirect("/listings");
    }
   
}
