import mongoose from "mongoose";

const ChannelChatSchema = new mongoose.Schema(
  {
    chat: { type: String, required: true },
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: { type: String, required: true },
    },
    channel: { type: mongoose.Schema.ObjectId, ref: "Channel" },
  },
  { timestamps: true }
);

export default mongoose.model("ChannelChat", ChannelChatSchema);
