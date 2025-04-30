const mongoose=require("mongoose");
const {Schema}=mongoose
const Review=require("./review.js");
const listingSchema=new mongoose.Schema({  
    title:{
        type:String,
        requires:true,
    },
    description:String,
    image: {
              filename: String,
              url: String,
            },
   
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User" //model name
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true,
            default: "Point"
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    category:{
        type:String,
        enum:["Trending","Boats","Camping","CreativeSpacing","Vineyards","Beachfront","AmazingPools","Lake","Arctic","Golfing"],
    }
});
listingSchema.post("findOneAndDelete",async(list)=>{
    if(list){
        await Review.deleteMany({_id:{$in:list.reviews}});
    }

});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;




  