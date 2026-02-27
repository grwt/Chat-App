import express from "express";
import { signUp ,login,logout,updateProfilePicture} from "../controller/auth.controller.js";

import {verifyToken} from "../middlewares/auth.middleware.js";



const router=express.Router();
router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile-picture",verifyToken,updateProfilePicture)

router.get("/check",verifyToken,(req,res)=>{
  res.status(200).json({message:"Authenticated",user:req.user});
})

export default router;
