import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        enum: ["fee","resource","login","account","attendance","other"]
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
});

export const FAQ = mongoose.model("FAQ", faqSchema);