import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js ";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT=process.env.PORT||3000;

app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)
connectDB();
});