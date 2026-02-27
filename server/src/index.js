import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js ";
import { connectDB } from "./lib/db.js";
import {ENV} from "./lib/env.js"; 

const app = express();
const PORT=ENV.PORT||3000;
app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)
connectDB();
});