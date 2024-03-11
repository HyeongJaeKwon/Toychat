import Chat from "../models/chat.js";
import User from "../models/user.js";

const chatController = {};

/** Create Chat */
chatController.saveMessage = async (message, roomid, user) => {
  try {
    const newChat = new Chat({
      chat: message,
      user: { id: user._id, name: user.name },
      room: roomid,
    });
    await newChat.save();
    return newChat;
  } catch (err) {
    throw err;
  }
};

/**Get all chats by roomid */
chatController.getAllChatsByRoomid = async (roomid) => {
  try{
    const list = Chat.find({room: roomid})
    return list
  }catch(err){
    throw err;
  }
}

/**Update Chat */
chatController.updateChat = async (cid, chatdata) => {
  try {
    const updatedChat = await User.findByIdAndUpdate(
      cid,
      { $set: userdata },
      { new: true }
    );
    return updatedChat;
  } catch (err) {
    throw err;
  }
};

/**Delete Chat */
chatController.deleteChat = async (cid) => {
  try {
    await Chat.findByIdAndDelete(cid);
    return "Chat deleted";
  } catch (err) {
    throw err;
  }
};

export default chatController;
