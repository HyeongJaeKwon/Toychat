import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Channel name required"] },
    private: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Channel", ChannelSchema);
