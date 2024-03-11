import Chat from "../models/chat.js";
import User from "../models/user.js";

const chatController = {};

chatController.saveMessage = async (message, id, user) => {
  try {
    const newChat = new Chat({
      chat: message,
      user: { id: user._id, name: user.name },
      room: id,
    });
    await newChat.save();

    return newChat;
  } catch (err) {
    return err;
  }
};

chatController.deleteChat = async (chatid) => {
  try {
    await Chat.findByIdAndDelete(chatid);
    return "Chat deleted";
  } catch (err) {
    return err;
  }
};

export default chatController;
