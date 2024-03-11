import Chat from "../models/chat.js";
import User from "../models/user.js";
import Room from "../models/room.js";

const roomController = {};

roomController.getAllRooms = async ()=>{
    const roomList = await Room.find({})
    return roomList
}


roomController.joinRoom = async (rid, user) => {
    const room = await Room.findById(rid);
    if (!room )throw new Error("No room found")

    if (!room.users.includes(user._id)){
        room.users.push(user._id);
        await room.save();
        user.rooms.push(rid);
        await user.save()

    }


}

roomController.leaveRoom = async ( user,id) => {
    const room = await Room.findById(id);
    if (!room) throw new Error ("Room not found")
    
    room.users.remove(user._id)
    await room.save();
}



export default roomController;
