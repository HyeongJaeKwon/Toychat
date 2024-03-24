import mongoose from "mongoose";

const ServerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must type name"],
    },
    photo: {
      type: String,
    },
    categories: [{ type: mongoose.Schema.ObjectId, ref: "Category" }],
    channels: [{ type: mongoose.Schema.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

export default mongoose.model("Server", ServerSchema);
