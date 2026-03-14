import express from "express";
import { signUp ,login,logout,updateProfilePicture} from "../controller/auth.controller.js";

import {verifyToken} from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";



const router=express.Router();
router.use(arcjetProtection);
router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile",verifyToken,updateProfilePicture)

router.get("/check",verifyToken,(req,res)=>{
  res.status(200).json({message:"Authenticated",user:req.user});
})

export default router;
