import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    name: String,
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);


export default mongoose.model("Room", RoomSchema);
