import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import puppeteer from "puppeteer";
import ejs from "ejs";
import { Student } from "../models/student.model.js";
import { SchoolResource } from "../models/resource.model.js";
import ClassMarks from "../models/marks.model.js";
import StudentMarks from "../models/studentMarks.model.js";
import { isTeacherAllowed } from "../utils/verificationUtils.js"
import { Exam } from "../models/exam.model.js";
import { ClassStructure } from "../models/classStructure.model.js";
import { getGrade } from "../utils/marksUtils.js"

/**
 * @desc Export class mark sheet template (To handfill marks physically)
 * @route POST /api/v1/marks/class-marksheet
 * @access Private (Teacher & Super Admin)
 */
export const exportClassMarklistTemplate = asyncHandler(async (req, res) => {
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

  if (
    !examId?.trim() ||
    !subject?.trim() ||
    !className?.trim() ||
    !div?.trim() ||
    !Array.isArray(students) ||
    !students.length ||
    !totalMarks
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const teacher = req.teacher;

  // Permission check
  if (!isTeacherAllowed(teacher, subject, className, div)) {
    throw new ApiError(
      403,
      "You are not allowed to add marks for this subject"
    );
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

  let subjectMarks = classMarks.subjects.find((s) => s.subject === subject);

  if (!subjectMarks) {
    classMarks.subjects.push({
      subject,
      students: [],
      gradedBy: teacher._id,
    });

    subjectMarks = classMarks.subjects[classMarks.subjects.length - 1];
  }

  const bulkOps = [];
  let allottedCount = 0;
  let skippedCount = 0;
  let alreadyMarked = [];

  for (const { studentId, marksObtained } of students) {
    const found = classStudentDocs.find((s) => s._id.toString() === studentId);

    if (!found) {
      skippedCount++;
      continue;
    }

    // Check if already marked for this subject
    const existing = subjectMarks.students.find(
      (s) => s.studentId.toString() === studentId
    );
    if (existing) {
      alreadyMarked.push(studentId);
      continue; // do not allow update
    }

    allottedCount++;

    // Add in ClassMarks
    subjectMarks.students.push({ studentId, marksObtained, totalMarks });

    // Add in StudentMarks
    bulkOps.push({
      updateOne: {
        filter: { examId, studentId },
        update: {
          $setOnInsert: { examId, studentId },
          $push: {
            marks: { subject, marksObtained, totalMarks, markedBy: teacher._id },
          },
        },
        upsert: true,
      },
    });
  }

  if (!allottedCount) {
    throw new ApiError(
      400,
      alreadyMarked.length
        ? "Marks already added check previous markings for updating"
        : "No valid students found for given class/div"
    );
  }

  classMarks.markModified("subjects");
  await classMarks.save();

  if (bulkOps.length) {
    await StudentMarks.bulkWrite(bulkOps, { ordered: false });
  }

  res.status(200).json(
    new ApiResponse(200, {
      message: "Marks Added Successfully",
      allottedCount,
      skippedCount,
      alreadyMarkedCount: alreadyMarked.length,
    })
  );
});

/**
 * @desc Update Already Added Marks
 * @route PUT /api/v1/update-class-marks
 * @access Private (Teacher)
 */
export const updateClassMarks = asyncHandler(async (req, res) => {
  const { examId, subject, className, div, students, totalMarks } = req.body;

  if (
    !examId?.trim() ||
    !subject?.trim() ||
    !className?.trim() ||
    !div?.trim() ||
    !Array.isArray(students) ||
    !students.length ||
    !totalMarks
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const teacher = req.teacher;

  // Permission check
  if (!isTeacherAllowed(teacher, subject, className, div)) {
    throw new ApiError(
      403,
      "You are not allowed to update marks for this subject"
    );
  }

  const classStudentDocs = await Student.find({ class: className, div }).select("_id");

  if (!classStudentDocs.length) {
    throw new ApiError(400, "No students found for given class/div");
  }

  const classMarks = await ClassMarks.findOne({ examId, class: className, div });

  if (!classMarks) {
    throw new ApiError(400, "Marks not found for this class/exam/subject");
  }

  const subjectMarks = classMarks.subjects.find((s) => s.subject === subject);

  if (!subjectMarks) {
    throw new ApiError(400, "Marks not found for this subject in class marks");
  }

  const bulkOps = [];
  let updatedCount = 0;
  let skippedCount = 0;
  let notMarkedStudents = [];

  for (const { studentId, marksObtained } of students) {
    const found = classStudentDocs.find((s) => s._id.toString() === studentId);

    if (!found) {
      skippedCount++;
      continue;
    }

    // Check if student exists in classMarks
    const existingClassStudent = subjectMarks.students.find(
      (s) => s.studentId.toString() === studentId
    );
    if (!existingClassStudent) {
      notMarkedStudents.push(studentId);
      continue; // skip students who have no existing marks
    }

    // Update ClassMarks
    existingClassStudent.marksObtained = marksObtained;
    existingClassStudent.totalMarks = totalMarks;

    // Prepare bulk update for StudentMarks
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
        upsert: false, // Only update existing, do not insert
      },
    });

    updatedCount++;
  }

  if (!updatedCount) {
    throw new ApiError(
      400,
      notMarkedStudents.length
        ? "Marks not found for these students, cannot update"
        : "No valid students to update"
    );
  }

  // Save ClassMarks
  classMarks.markModified("subjects");
  await classMarks.save();

  if (bulkOps.length) {
    await StudentMarks.bulkWrite(bulkOps, { ordered: false });
  }

  res.status(200).json(
    new ApiResponse(200, {
      message: "Marks Updated Successfully",
      updatedCount,
      skippedCount,
      notMarkedCount: notMarkedStudents.length,
    })
  );
});



/**
 * @desc Get teacher marks data (Exams,Previous Markings)
 * @route GET /api/v1/marks/teacher-data
 * @access Private (Teacher)
 */
export const getTeacherMarksData = asyncHandler(async (req, res) => {
  const teacher = req.teacher;
  if (!teacher) {
    return res.status(400).json({ message: "Teacher not found in request" });
  }


  const exams = await Exam.find({ schoolId: req.school?._id }).select("_id name");

  // Fetch only marks graded by this teacher
  const teacherMarks = await StudentMarks.find({
    "marks.markedBy": teacher._id,
  })
    .populate("examId", "name")
    .populate({
      path: "studentId",
      select: "class div userId",
      populate: {
        path: "userId",
        select: "fullName",
      },
    });
  
  // Organize data in nested structure
  const examMap = new Map();

  teacherMarks.forEach((sm) => {
    const examName = sm.examId?.name;
    if (!examName) return;

    if (!examMap.has(examName)) {
      examMap.set(examName, { _id:sm.examId._id,name:examName, subjects: [] });
    }
    const examObj = examMap.get(examName);

    sm.marks.forEach((mark) => {
      if (String(mark.markedBy) !== String(teacher._id)) return;

      // check subject exists or push
      let subjectObj = examObj.subjects.find((s) => s.name === mark.subject);
      if (!subjectObj) {
        subjectObj = { name: mark.subject, classes: [] };
        examObj.subjects.push(subjectObj);
      }

      // check class exists
      let classObj = subjectObj.classes.find((c) => c.class === sm.studentId.class);
      if (!classObj) {
        classObj = { class: sm.studentId.class, divs: [] };
        subjectObj.classes.push(classObj);
      }

      // check div exists
      let divObj = classObj.divs.find((d) => d.div === sm.studentId.div);
      if (!divObj) {
        divObj = { div: sm.studentId.div, students: [] };
        classObj.divs.push(divObj);
      }

      // push student marks
      divObj.students.push({
        studentId: sm.studentId._id,
        name: sm.studentId.userId?.fullName,
        marksObtained: mark.marksObtained,
        totalMarks: mark.totalMarks,
      });
    });
  });
  
  res.status(200).json(new ApiResponse(200, {exams, previousMarkings: Array.from(examMap.values())}, "Teacher marks data fetched successfully"));
});

/**
 * @desc Get class marks data for a particular exam
 * @route GET /api/v1/marks/class-marks-data
 * @access Private (SuperAdmin)
 */
export const getClassMarksData = asyncHandler(async (req, res) => {
  const { examId, className, div } = req.body;

  if (!examId?.trim() || !className?.trim() || !div?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  const classMarks = await ClassMarks.findOne({
    examId,
    class: className,
    div,
  })
    .select("subjects isPublished")
    .populate({
      path: "subjects.gradedBy",
      select: "userId",
      populate: {
        path: "userId",
        select: "fullName",
        model: "User",
      },
      model: "Teacher",
    })
    .populate({
      path: "subjects.students.studentId",
      select: "userId",
      populate: {
        path: "userId",
        select: "fullName",
        model: "User",
      },
      model: "Student",
    })
    .lean(); 

  const transformed = {
    isPublished: classMarks?.isPublished || false,
    subjects: classMarks?.subjects?.map((subj) => ({
      subject: subj.subject,
      gradedBy: subj.gradedBy?.userId?.fullName || "N/A",
      students: subj.students.map((stu) => ({
        fullName: stu.studentId?.userId?.fullName || "Unknown",
        marksObtained: stu.marksObtained,
        totalMarks: stu.totalMarks,
      })),
    })),
  };

  const resource = await SchoolResource.findOne({ class: className })
  .select("subjects.subjectName -_id")
  .lean();
  const subjectNames = resource?.subjects.map(s => s.subjectName) || [];

  res
    .status(200)
    .json(new ApiResponse(200, {marks: transformed,subjectNames}, "Marks data fetched successfully"));
});

/**
 * @desc Get Initial Data for superadmin marks tab
 * @route GET /api/v1/marks/superadmin-data
 * @access Private (Super Admin)
 */
export const getSuperAdminData = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ schoolId: req.school?._id }).select("_id name");
  const classes = await ClassStructure.find({ schoolId: req.school?._id }).select('className divisions');

  res.status(200).json(new ApiResponse(200, {exams, classes}, "Superadmin data fetched successfully"));
});

/**
 * @desc Get student marks data for a particular exam (Grades for lower classes and marks for higher classes)
 * @route GET /api/v1/marks/student-data
 * @access Private (Student)
 */
export const getStudentMarksData = asyncHandler(async (req, res) => {
  const marks =
    (await StudentMarks.find({ studentId: req.student?._id }) 
      .select("examId marks")
      .populate({
        path: "examId",
        select: "name", 
      })
      .populate({
        path: "marks.markedBy",
        select: "userId",
        populate: {
          path: "userId",
          select: "fullName",
        },
      })) ?? [];

  if (!marks || marks.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No marks found for this student"));
  }

  // If class is below 8 → return grades for each exam
  if (req.student.class < 8) {
    const gradesData = marks.map((exam) => ({
      id: exam._id,
      examId: exam.examId,
      grades: exam.marks.map((m) => ({
        subject: m.subject,
        grade: getGrade(m.marksObtained, m.totalMarks),
        markedBy: {userId:{fullName: m.markedBy?.userId?.fullName || "N/A"}},
      })),
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, gradesData, "Grades fetched successfully"));
  }

  // Else → return marks as they are (array of exams)
  return res
    .status(200)
    .json(new ApiResponse(200, marks, "Student marks fetched successfully"));
});

