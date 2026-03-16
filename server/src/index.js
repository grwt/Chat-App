import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import {ENV} from "./lib/env.js"; 
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
  });
}

server.listen(PORT,()=>{console.log(`server running on port ${PORT}`)
connectDB();
});
