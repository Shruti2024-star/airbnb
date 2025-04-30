const User=require("../models/authenticate.js");

module.exports.renderSignUp=(req,res)=>{
    res.render("authenticate/signUp.ejs");
};
module.exports.signUp=async(req,res)=>{
        try{
        let{username,email,password}=req.body
        const newUser=await new User({email,username});
        const registeredUser=await User.register(newUser,password);
        
        req.login(registeredUser,(err)=>{
        
            if(err){
                return next(err);
            }
            req.flash("success","Registered Successfully");
            res.redirect("/listings");
        })
        
       
        }catch(e){
            req.flash("error",e.message);
            res.redirect("/signUp");

        }
}
module.exports.renderLogin=(req,res)=>{
    res.render("authenticate/login.ejs");
}
module.exports.login= async(req,res)=>{
    req.flash("success","Welcome back to wanderlust");  
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}