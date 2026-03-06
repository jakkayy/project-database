import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: String,
  userMessage: String,
  aiReply: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);