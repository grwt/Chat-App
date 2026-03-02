import aj from "../lib/arcjet.js";
import {isSpoofedBot} from "@arcjet/inspect";

export const arcjetProtection=async(req,res,next)=>{
  try {
    const decision=await aj.protect(req);
    if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        return res.status(429).json({message: "Too many requests. Please try again later."});
      }
      else if(decision.reason.isBot()){
        return res.status(403).json({message: "Access denied. Bots are not allowed."});
      }
      else{
        return res.status(403).json({message: "Access denied."});
      }
    }
    //check for spoofed bots
    if (decision.results.some(isSpoofedBot)){
      return res.status(403).json({
        message: "Access denied. Malicious bot detected.",
        error: "Spoofed bot detected. Please contact support if you believe this is an error."
      });
    }
    next();
  } catch (error) {
    console.error("Error in Arcjet middleware:", error);
    next();
  }
}
