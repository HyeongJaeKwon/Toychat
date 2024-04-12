import Category from "../models/category.js";
import Channel from "../models/channel.js";
import channelChatController from "./channelchat.js";

const channelController = {};

// /**Create Room */
// channelController.createRoom = async (user, otheruid) => {
//   try {
//     console.log("Create Room STARTED!!!")
//     if (user._id.toString() === otheruid.toString() )throw new Error("Yourself Error")
//     const other = await User.findById(otheruid);
//     const existingRoom = await Room.findOne({
//       users: { $all: [user._id, otheruid] },
//     });

// //ROOM DB ALREADY EXIST
// console.log("ROOM DB ALREADY EXIST")
//     if (existingRoom) {
//       const data = {
//         exist: true,
//         room: existingRoom,
//         user: user,
//       };

//       /**in case user.rooms does not exist.... */
//       if (user.rooms === null) {
//         user.rooms = [];
//         data.user = await User.findByIdAndUpdate(user._id, user, { new: true });
//       }

//   //USER.ROOMS DOESNT HAVE ROOM ID
//       if (!user.rooms.some((each) => each.toString() === existingRoom._id.toString())) {
//   console.log("USER.ROOMS DOESNT HAVE ROOM ID")

//         data.user = await User.findByIdAndUpdate(
//           user._id,
//           { $push: { rooms: existingRoom._id } },
//           { new: true }
//         );
//         data.added = true;
//       } else {

//   //USER.ROOMS ALREADY HAVE ROOM ID
//   console.log("USER.ROOMS ALREADY HAVE ROOM ID")
//         data.added = false;
//       }

//       return data;
//     } else {
// //ROOM DB DOESNT EXIST
// console.log("ROOM DB DOESNT EXIST")

//       //make new ROOM DB
//       const room = new Room({
//         name: user.name + " & " + other.name,
//         users: [user._id, other._id],
//       });
//       await room.save();

//       //USER.ROOMS UPDATE
//       console.log("USER.ROOMS UPDATE")
//       const updatedUser = await User.findByIdAndUpdate(
//         user._id,
//         { $push: { rooms: room._id } },
//         { new: true }
//       );

//             // await User.findByIdAndUpdate(other._id, { $push: { rooms: room._id } });

//       const data = {
//         exist: false,
//         added: true,
//         room: room,
//         user: updatedUser,
//       };

//       return data;
//     }
//   } catch (err) {
//     throw err;
//   }
// };

channelController.createChannel = async (cname, ctype, cprivate, ctid) => {
  try {
    assert(ctype === "voice" || ctype === "text");
    const channel = new Channel({
      name: cname,
      users: [],
      type: ctype,
      private: cprivate,
    });

    await channel.save();

    //Category Update
    const updatedCategory = await Category.findByIdAndUpdate(
      ctid,
      { $push: { channels: channel._id } },
      { new: true }
    );

    return channel;
  } catch (err) {
    throw err;
  }
};

channelController.getAllChannelsByCategoryId = async (ctid) => {
  try {
    const category = await Category.findById(ctid);
    const channelList = await Promise.all(
      category.channels.map(async (cid) => {
        const channel = await Channel.findById(cid);
        return channel;
      })
    );
    return channelList;
  } catch (err) {
    throw err;
  }
};

/** Get channel (cid) */
channelController.getChannel = async (cid) => {
  try {
    const channel = await Channel.findById(cid);
    return channel;
  } catch (err) {
    throw err;
  }
};

/**Update channel */
// NOT YET

/** delete Channel + delete all the channelchats inside it */
channelController.deleteChannel = async (cid) => {
  try {
    await channelChatController.deleteAllChats(cid);
    Channel.findByIdAndDelete(cid);
    return "Channel deleted";
  } catch (err) {
    throw err;
  }
};

export default channelController;
