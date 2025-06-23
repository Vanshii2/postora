import User from '../models/user.model.js'
import jwt from "jsonwebtoken"

export const protectRoute= async(req,res,next)=>{
    try{
        //getting token from cookies
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorized : No token provided"})
        }
        //cokkie invalid--> verify token with jwt secret 
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded)
        {
            return res.status(401).json({error:"Unautorized : Invalid token"})
        }
        //here user id   send to req object
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({error:"USer not found"})
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log("error in protectRoute middlewarer",error.message);
        res.status(500).json({error:"Internal server error"});

    }
}