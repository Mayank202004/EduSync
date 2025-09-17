import mongoose from "mongoose";

const studentMarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
});

const subjectMarksSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  students: [studentMarkSchema],
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

const classMarksSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  class: { type: String, required: true },
  div: { type: String, required: true },
  subjects: [subjectMarksSchema],
  isPublished : { type: Boolean, default: false}
}, { timestamps: true });

export default mongoose.model("ClassMarks", classMarksSchema);
