import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";
import chatController from "../controllers/chat.js";

const router = express.Router();

router.get("/:roomid", async (req, res) => {
  // req => params  == room id
  try {
    const allChats = await Chat.find({ room: req.params.roomid });

    return res.json(allChats);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.delete("/:chatid", async (req, res)=>{
  try {

    await chatController.deleteChat(req.params.chatid);
    return res.json("Chat has been deleted");

  } catch (err) {
    res.json({ error: err.message });
  }
})



export default router;
