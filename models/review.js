const mongoose=require("mongoose");
const {Schema}=mongoose;



const reviewSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:0,
        max:5

    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User" //model name
    }
   
});

module.exports=mongoose.model("review",reviewSchema);