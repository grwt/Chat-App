import express from "express";
import {
  getAllContacts,
  getAllChats,
  getMessageByUserId,
  sendMessage } from "../controller/message.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
const router=express.Router();


router.use(arcjetProtection,verifyToken);
router.get("/contacts",getAllContacts);
router.get("/chats",getAllChats);
router.get("/:id", getMessageByUserId);
router.post("/send/:id",sendMessage);

export default router;