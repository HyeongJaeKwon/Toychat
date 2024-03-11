import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";

const router = express.Router();

//update
router.post("/", async (req, res) => {
  const u = await User.findOne({ name: "dd" });

  await Room.insertMany([
    { name: "First Chatroom", users: [u._id] },
    { name: "Second Chatroom", users: [u._id] },
    { name: "Third Chatroom", users: [u._id] },
  ])
    .then(() => {
      res.json({ message: "Room has been created" });
    })
    .catch((err) => res.json(err));
});

export default router;
