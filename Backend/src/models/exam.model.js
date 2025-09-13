import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Mid Term"
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
