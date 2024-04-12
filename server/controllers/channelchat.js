import ChannelChat from "../models/channelchat.js";
import User from "../models/user.js";

const channelChatController = {};

/** Create ChannelChat */
channelChatController.saveMessage = async (message, cid, user) => {
  try {
    const newChat = new ChannelChat({
      chat: message,
      user: { id: user._id, name: user.name },
      channel: cid,
    });
    await newChat.save();
    return newChat;
  } catch (err) {
    throw err;
  }
};

/**Get all chats by roomid */
channelChatController.getAllChatsByChannelid = async (cid) => {
  try {
    const list = ChannelChat.find({ channel: cid });
    return list;
  } catch (err) {
    throw err;
  }
};

/**Update Chat */
channelChatController.updateChat = async (ccid, chatdata) => {
  try {
    const updatedChat = await ChannelChat.findByIdAndUpdate(
      ccid,
      { $set: chatdata },
      { new: true }
    );
    return updatedChat;
  } catch (err) {
    throw err;
  }
};

/**Delete Chat */
channelChatController.deleteChat = async (ccid) => {
  try {
    await ChannelChat.findByIdAndDelete(ccid);
    return "Chat deleted";
  } catch (err) {
    throw err;
  }
};

/**Delete all chats with channel id  */
channelChatController.deleteAllChats = async (cid) => {
  try {
    await ChannelChat.deleteMany({ channel: cid });
    return "ChannelChats deleted"
  } catch (err) {
    throw err;
  }
};

export default channelChatController;
