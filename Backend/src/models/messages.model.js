import mongoose, { Schema } from "mongoose";

// TODO: Add image and pdf file sharing in the next version
const chatMessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    attachments: {
      type: [
        {
          url: { type: String, required: true },
          name: { type: String },
          type: { type: String },
        },
      ],
      default: [],
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    meetingId:{
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model("ChatMessage", chatMessageSchema);
