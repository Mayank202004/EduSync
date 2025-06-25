import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    issuedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    issuerEmail: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/ 
    },
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed','resolved'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    }
},{
    timestamps: true
});

export const Ticket = mongoose.model("Ticket", ticketSchema);