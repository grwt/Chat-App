import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

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


export const login=async(req,res)=>{
  const {email,password}=req.body;
  try{
    if(!email||!password){
      return res.status(400).json({message:"All fields are required"});
    }
    const user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"Invalid credentials"});
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

    generateToken(user._id,res);
    res.status(200).json({
      message:"Login successful",
     _id:user._id,
     fullName:user.fullName,
      email:user.email,
      profilePicture:user.profilePicture
    });
  }
  catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({message:"Server error"});
  }
}

export const logout=(_,res)=>{
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"logged out succesfully"});
}

export const updateProfilePicture=async(req,res)=>{
  try {
    const {profilePicture}=req.body;
    if(!profilePicture) return res.status(400).json({message:"Profile picture is required"});

    const userId=req.user._id;
    const uploadResult=await cloudinary.uploader.upload(profilePicture);
    const updateUser=await User.findByIdAndUpdate(userId,{profilePicture:uploadResult.secure_url},{
      new:true,
    });
    if(!updateUser) return res.status(404).json({message:"User not found"});

    res.status(200).json({message:"Profile picture updated successfully",profilePicture:updateUser.profilePicture});


  } catch (error) {
    return res.status(500).json({message:"Server error"});
  }
}