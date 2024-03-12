import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must type name"],
    unique: true,
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
  rooms: [{type:mongoose.Schema.ObjectId, ref:"Room"}],
  friends: [{type:mongoose.Schema.ObjectId, ref:"User"}]
});


export default mongoose.model("User", UserSchema)