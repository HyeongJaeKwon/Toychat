import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";
import chatController from "../controllers/chat.js";
////////===========================================
import ChannelChat from "../models/channelchat.js";


const router = express.Router();

router.get("/:channelid", async (req, res) => {
  // req => params  == room id
  try {
    const allChannelChats = await ChannelChat.find({ channel: req.params.channelid });

    return res.json(allChannelChats);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.delete("/:channelchatid", async (req, res)=>{
  try {

    await channelChatController.deleteChat(req.params.channelchatid);
    return res.json("Chat has been deleted");

  } catch (err) {
    res.json({ error: err.message });
  }
})



export default router;
