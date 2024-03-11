import mongoose from "mongoose";


const ChatSchema = new mongoose.Schema(
  {
    chat: { type: String, required: true },
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: { type: String, required: true },
    },
    room: {type: mongoose.Schema.ObjectId, ref:"Room"}
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
