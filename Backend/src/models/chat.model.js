import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Class 10-A" or "School Channel"
    },
    isGroupChat: {
      type: Boolean,
      default: false, // true for class/school channels, false for private chats
    },
    className: String, // e.g., "10" – used only for class group filtering
    div: String,       // e.g., "A" – used with className for student’s class chat
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
  },
  { timestamps: true }
);
