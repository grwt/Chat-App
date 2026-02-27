import jwt from "jsonwebtoken";
import {ENV} from "./env.js";
export const generateToken=(userId,res)=>{
  const id= userId;
  const token=jwt.sign({id},ENV.JWT_SECRET_KEY,{
    expiresIn:"7d",
  });
res.cookie("jwt",token,{
  maxAge:7*24*60*60*1000,
  httpOnly:true,
  sameSite:"strict",
  secure:ENV.NODE_ENV==="development"?false:true,
})
return token;
};