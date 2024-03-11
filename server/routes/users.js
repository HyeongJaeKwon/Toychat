import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";
import userController from "../controllers/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // req => params  == room id
  try {
    const list = await userController.getAllUsers()

    return res.json(list);
  } catch (err) {
    res.json({ error: err.message });
  }
});





export default router;
