import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";
import roomController from "../controllers/room.js";

const router = express.Router();


/** Create Room */
router.post("/", async (req, res) => {
  //req => user, other 
  try{
    const data = await roomController.createRoom(req.body.user, req.body.other);
    //data => exist, room 
    res.json(data)
  }catch(err){
    res.json(err);
  }
});

/** delete room from user.rooms */
router.delete("/", async (req, res) => {
  //req => user, roomid
  try{
    console.log(req.body)
    const updatedUser = await roomController.leaveRoom(req.body.user, req.body.roomid);

    res.json(updatedUser)
  }catch(err){
    res.json(err);
  }
});

export default router;