import mongoose from "mongoose";

/**
 * @desc This model is created (which overlaps marks.model) to reduce the complexity of fetching for a single student
*/
const studentMarksSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  class: { type: String, required: true },
  div: { type: String, required: true },
  marks: [
    {
      subject: { type: String, required: true },
      marksObtained: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
      markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    }
  ],
  isPublished : { type: Boolean, default: false},
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
}, { timestamps: true });

export default mongoose.model("StudentMarks", studentMarksSchema);
