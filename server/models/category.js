import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Category name required"] },
    channels: [{ type: mongoose.Schema.ObjectId, ref: "Channel" }],
    private: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
