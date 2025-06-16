// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // 'school', 'class-10A', 'private-studentId-teacherId'
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for group messages
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
},);

export const Message = mongoose.model("Message", messageSchema);
