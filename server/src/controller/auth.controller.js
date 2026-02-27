import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js";

export const signUp=async(req,res)=>{
  const {fullName,email,password}=req.body;

  try {
    if(!fullName|| !email || !password){
      return res.status(400).json({message:"All fields are required"});
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
      }

      const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email format"});
      }

      const user= await User.findOne({email});
      if(user) return res.status(400).json({message:"Email already exists"});

      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt);

      const newUser= await User.create({
        fullName,
        email,
        password:hashedPassword
      })

      if(newUser){
        const savedUser=await newUser.save();
        generateToken(savedUser._id,res);
         res.status(201).json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email
      }
      });

      //todo: send a welcome email to the user after successful registration
      try {
        await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL);
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }


      }
      else{
        res.status(400).json({message:"Invalid user data"});
      }

      
      
  } catch (error) {
    console.log("Error in signUp controller", error.message);
    res.status(500).json({message:"Server error"});
  }

}