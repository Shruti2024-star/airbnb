const joi=require("joi");

module.exports.listingSchema=joi.object(
    {
        listing:joi.object({
            title:joi.string().required(),
            description:joi.string().required(),
            location:joi.string().required(),
            country:joi.string().required(),
            price:joi.string().required().min(0),
            image: joi.any() ,
            category: joi.string()
            .valid('Trending', 'Boats', 'Camping', 'CreativeSpacing', 'Vineyards', 'Beachfront', 'AmazingPools', 'Lake', 'Arctic', 'Golfing')
            .trim()
            .required(),

            


        }).required(),
    }
)

//review joi schema
module.exports.reviewSchema=joi.object(
    {
        review:joi.object({
            comment:joi.string().required(),
            rating:joi.number().required().min(0).max(5),
           
        }).required(),
    }
)