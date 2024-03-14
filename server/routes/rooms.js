import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";
import roomController from "../controllers/room.js";
import userController from "../controllers/user.js";

const router = express.Router();


/** Create Room */
router.post("/", async (req, res) => {
  //req => user, otheruid
  try{
    const data = await roomController.createRoom(req.body.user, req.body.other);
    //data => exist, added, room, user 
    res.json(data)
  }catch(err){
    res.json(err);
  }
});

/** Get ALl Rooms + Other by uid */
router.get("/:uid", async (req, res)=>{
  try{

    const data = await roomController.getAllRoomsByUserId(req.params.uid);
    // data => [{ room, other}, ... ]
    console.log("get all rooms by user id DATA => room, other")
    res.json(data);

  }
  catch(err){
    res.json(err)
  }
})

/**Get room info + other info */
router.get("/roomid/:rid/:uid", async (req, res)=>{
  try{

    const room = await roomController.getRoom(req.params.rid);
    const otheruid = room.users[0].toString() === req.params.uid ? room.users[1].toString() : room.users[0].toString()
    const other = await User.findById(otheruid);
    const data = {
      room:room,
      other:other
    }

    res.json(data)
  }
  catch(err){
    res.json(err)
  }
})

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
