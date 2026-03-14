import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import {ENV} from "./lib/env.js"; 
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT=ENV.PORT||3000;

app.use(cors({
  origin:ENV.CLIENT_URL,
  credentials:true,
}))
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)
connectDB();
});