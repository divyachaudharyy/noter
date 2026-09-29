import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled" },
    userId: { type: String, required: true },
    parentPage: { type: mongoose.Schema.Types.ObjectId, ref: "Page", default: null },
    content: { type: String, default: "" }, // will hold BlockNote JSON later
    icon: { type: String, default: null },
    coverImage: { type: String, default: null },
    isArchived: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model("Page", PageSchema);