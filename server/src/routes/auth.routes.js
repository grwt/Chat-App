import express from "express";
import { signUp } from "../controller/auth.controller.js";



const router=express.Router();
router.post("/signup",signUp);

router.get("/login",(req,res)=>{
  res.send("login page")
});

router.get("/logout",(req,res)=>{
  res.send("logout page")
});


export default router;
