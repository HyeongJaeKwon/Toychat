import Chat from "../models/chat.js";
import User from "../models/user.js";
import Room from "../models/room.js";
import room from "../models/room.js";

const roomController = {};

/**Create Room */
roomController.createRoom = async (user, otheruid) => {
  try {
    console.log("Create Room STARTED!!!")
    if (user._id.toString() === otheruid.toString() )throw new Error("Yourself Error")
    const other = await User.findById(otheruid);
    const existingRoom = await Room.findOne({
      users: { $all: [user._id, otheruid] },
    });


//ROOM DB ALREADY EXIST
console.log("ROOM DB ALREADY EXIST")
    if (existingRoom) {
      const data = {
        exist: true,
        room: existingRoom,
        user: user,
      };

      /**in case user.rooms does not exist.... */
      if (user.rooms === null) {
        user.rooms = [];
        data.user = await User.findByIdAndUpdate(user._id, user, { new: true });
      }


  //USER.ROOMS DOESNT HAVE ROOM ID
      if (!user.rooms.some((each) => each.toString() === existingRoom._id.toString())) {
  console.log("USER.ROOMS DOESNT HAVE ROOM ID")

        data.user = await User.findByIdAndUpdate(
          user._id,
          { $push: { rooms: existingRoom._id } },
          { new: true }
        );
        data.added = true;
      } else {

  //USER.ROOMS ALREADY HAVE ROOM ID
  console.log("USER.ROOMS ALREADY HAVE ROOM ID")
        data.added = false;
      }

      return data;
    } else {
//ROOM DB DOESNT EXIST
console.log("ROOM DB DOESNT EXIST")

      //make new ROOM DB
      const room = new Room({
        name: user.name + " & " + other.name,
        users: [user._id, other._id],
      });
      await room.save();

      //USER.ROOMS UPDATE
      console.log("USER.ROOMS UPDATE")
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $push: { rooms: room._id } },
        { new: true }
      );

            // await User.findByIdAndUpdate(other._id, { $push: { rooms: room._id } });

      const data = {
        exist: false,
        added: true,
        room: room,
        user: updatedUser,
      };

      return data;
    }
  } catch (err) {
    throw err;
  }
};

/** Get rooms (uid) AND OTHER*/
roomController.getAllRoomsByUserId = async (uid) => {
  try {
    const user = await User.findById(uid);
    const roomList = await Promise.all(
      user.rooms.map(async (roomid) => {
        const room = await Room.findById(roomid);
        return room;
      })
    );

    const otherList =  await Promise.all(roomList.map(async (room)=>{
      const otheruid = room.users[0].toString() === uid ? room.users[1] : room.users[0]
      const other = await User.findById(otheruid)
      if( !other){
        return {_id: null }
      }else{
        return other
      }
    }))

    const data = roomList.map((each,index)=>{
      return {room:each, other: otherList[index]}
    })

   

    return data;
  } catch (err) {
    throw err;
  }
};

/** Get room (rid) */
roomController.getRoom = async (rid) => {
  try {
    const room = await Room.findById(rid);
    return room;
  } catch (err) {
    throw err;
  }
};

/**Update room */
roomController.updateUser = async (rid, roomdata) => {
  try {
    const updatedRoom = await User.findByIdAndUpdate(
      rid,
      { $set: roomdata },
      { new: true }
    );
    return updatedRoom;
  } catch (err) {
    throw err;
  }
};

/** [ALL ROOMS REMAIN IN DB]  Delete Room (only from user.rooms) */
roomController.leaveRoom = async (user, roomid) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { rooms: roomid } },
      { new: true }
    );
    return updatedUser;
  } catch (err) {
    throw err;
  }
};

// roomController.joinRoom = async (rid, user) => {
//   const room = await Room.findById(rid);
//   if (!room) throw new Error("No room found");

//   if (!room.users.includes(user._id)) {
//     room.users.push(user._id);
//     await room.save();
//     user.rooms.push(rid);
//     await user.save();
//   }
// };

export default roomController;
