import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { Student } from "../models/student.model.js";
import ClassMarks from "../models/marks.model.js";
import StudentMarks from "../models/studentMarks.model.js";
import { isTeacherAllowed } from "../utils/verificationUtils.js"

/**
 * @desc Export class mark sheet template (To handfill marks physically)
 * @route POST /api/v1/marks/class-marksheet
 * @access Private (Teacher & Super Admin)
 */
export const exportClassMarkSheet = asyncHandler(async (req, res) => {
  const { className, div } = req.body;

  if(!className?.trim() || !div?.trim()){
    throw new ApiError(400,"Class and div are required");
  }

  const students = await Student.find({
    schoolId: req.school._id,
    class: className,
    div
  })
    .select("_id userId")
    .populate("userId", "fullName")
    .sort({ "userId.fullName": 1 })
    .lean();


  if (!students.length) {
    throw new ApiError(404, "No students found for given class/div");
  }

  const html = await ejs.renderFile("src/templates/classMarksheet.template.ejs", {
    students,
    className,
    div
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "15mm", bottom: "10mm", left: "15mm" }
  });
  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="marksheet-${className}${div}.pdf"`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});

/**
 * @desc Get student marks
 * @route GET /api/v1/marks/me
 * @access Private (Student)
 */
export const getStudentMarks = asyncHandler(async (req, res) => {
  const marks = await StudentMarks.findOne({ studentId: req.student._Id }) ?? [];
  res.status(200).json(new ApiResponse(200, marks, "Student marks fetched successfully"));
})

/**
 * @desc Teacher adds marks for students (bulk insert/update)
 * @route POST /api/v1/marks
 * @access Private (Teacher)
 */
export const addClassMarks = asyncHandler(async (req, res) => {
  const { examId, subject, className, div, students, totalMarks } = req.body;

  if (!examId?.trim() || !subject?.trim() || !className?.trim() || !div?.trim() || !Array.isArray(students) || !students.length || !totalMarks){
    throw new ApiError(400, "All fields are required");
  }

  const teacher = req.teacher;

  // Permission check
  if (!isTeacherAllowed(teacher, subject, className, div)) {
    throw new ApiError(403, "You are not allowed to add marks for this subject");
  }

  const classStudentDocs = await Student.find({ class: className, div }).select("_id");

  if (!classStudentDocs.length) {
    throw new ApiError(400, "No students found for given class/div");
  }


  let classMarks = await ClassMarks.findOne({ examId, class: className, div });

  if (!classMarks) {
    classMarks = new ClassMarks({
      examId,
      class: className,
      div,
      subjects: [],
    });
  }

  let subjectMarks = classMarks.subjects.find(s => s.subject === subject);

  if (!subjectMarks) {
    subjectMarks = { subject, students: [], gradedBy: teacher._id };
    classMarks.subjects.push(subjectMarks);
  }

  const bulkOps = [];
  let allottedCount = 0;
  let skippedCount = 0;

  students.forEach(({ studentId, marksObtained }) => {
    const found = classStudentDocs.find(s => s._id.toString() === studentId);

    if (!found) {
      skippedCount++;
      return; // skip invalid studentId
    }

    allottedCount++;

    // Update/add in ClassMarks
    const existing = subjectMarks.students.find(s => s.studentId.toString() === studentId);
    if (existing) {
      existing.marksObtained = marksObtained;
      existing.totalMarks = totalMarks;
    } else {
      subjectMarks.students.push({ studentId, marksObtained, totalMarks });
    }

    // Prepare StudentMarks bulkOps
    bulkOps.push({
      updateOne: {
        filter: { examId, studentId, "marks.subject": subject },
        update: {
          $set: {
            "marks.$.marksObtained": marksObtained,
            "marks.$.totalMarks": totalMarks,
            "marks.$.markedBy": teacher._id,
          },
        },
      },
    });

    bulkOps.push({
      updateOne: {
        filter: { examId, studentId, "marks.subject": { $ne: subject } },
        update: {
          $setOnInsert: { examId, studentId },
          $push: {
            marks: { subject, marksObtained, totalMarks, markedBy: teacher._id },
          },
        },
        upsert: true,
      },
    });
  });

  if (!allottedCount) {
    throw new ApiError(400, "No valid students found for given class/div");
  }

  await classMarks.save();

  if (bulkOps.length) {
    await StudentMarks.bulkWrite(bulkOps, { ordered: false });
  }

  res.status(200).json(
    new ApiResponse(200, {
      message: "Marks Added Successfully",
      allottedCount,
      skippedCount,
    })
  );
});
