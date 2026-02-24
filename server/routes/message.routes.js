import express from "express";
const router=express.Router();

router.get("/send",(req,res)=>{
  res.send("message page");
})

export default router;