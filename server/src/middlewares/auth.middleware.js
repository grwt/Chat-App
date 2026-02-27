import jwt from "jsonwebtoken";
import {ENV} from "../lib/env.js";
import User from "../models/user.model.js";

export const verifyToken=async(req,res,next)=>{
  try {
    const token=req.cookies.jwt;
    if(!token) return res.status(401).json({message:"Unauthorized, no token provided"})
      const decodedToken=jwt.verify(token,ENV.JWT_SECRET_KEY);
    if(!decodedToken) return res.status(401).json({message:"Unauthorized,invalid token"});
    const user=await User.findById(decodedToken.id).select("-password");
    if(!user) return res.status(404).json({message:"user not found"});

    req.user=user;
    next();
  
  } catch (error) {
    console.log("Error in verifyToken middleware:", error);
    res.status(500).json({message:"Internal server error"});
  }

}