import mongoose from "mongoose";
import {ENV} from "./env.js";
export const connectDB=async()=>{
  try {
    const conn=await mongoose.connect(ENV.MONGO_URI);
    console.log("connected to database", conn.connection.host);
  } catch (error) {
    console.error("error connecting to database", error.message);
    process.exit(1);
  }
}