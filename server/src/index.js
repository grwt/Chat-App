import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import {ENV} from "./lib/env.js"; 
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

const PORT=ENV.PORT||3000;

app.use(cors({
  origin:ENV.CLIENT_URL,
  credentials:true,
}))
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/messages", messageRouter);

server.listen(PORT,()=>{console.log(`server running on port ${PORT}`)
connectDB();
});