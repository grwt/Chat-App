import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";

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
        generateToken(newUser._id,res);
        await newUser.save();
         return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email
      }
      });

      //todo: send a welcome email to the user after successful registration

      }
      else{
        res.status(400).json({message:"Invalid user data"});
      }

      
      
  } catch (error) {
    console.log("Error in signUp controller", error.message);
    res.status(500).json({message:"Server error"});
  }

}