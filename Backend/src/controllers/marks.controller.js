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
import { cleanClassTeacherMarks,cleanTeacherMarks, getGrade, transformClassMarks } from "../utils/marksUtils.js"
import { getAttendanceSummary } from "./attendence.controller.js";
import { getSettingValue } from "./setting.controller.js"
import pdf from "html-pdf-node";


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
  const schoolId = req.school._id;

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
      schoolId,
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
          $setOnInsert: { examId, studentId, class: className, div, schoolId },
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
  let teacherMarks = await StudentMarks.find({
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

  let classTeacherData = [];
  let resource = [];
  let coordinatorData = [];

  // ---------- CLASS TEACHER CASE ----------
  if (teacher.classTeacher?.class && teacher.classTeacher?.div) {
    classTeacherData = await ClassMarks.find({
      class: teacher.classTeacher.class,
      div: teacher.classTeacher.div,
      schoolId: req.school?._id,
    })
      .select("examId subjects isPublished")
      .populate("examId", "name")
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
        select: "class div userId",
        populate: {
          path: "userId",
          select: "fullName",
        },
      });

    resource = await SchoolResource.findOne({ class: teacher.classTeacher.class, schoolId: req.school?._id })
      .select("subjects.subjectName -_id")
      .lean();
  }
  // ---------- CLASS COORDINATOR CASE ----------
  else if (teacher.classCoordinator) {
    const allClassMarks = await ClassMarks.find({ class: teacher.classCoordinator, schoolId: req.school?._id })
      .select("examId class div subjects isPublished")
      .populate("examId", "name")
      .populate({
        path: "subjects.gradedBy",
        select: "userId",
        populate: { path: "userId", select: "fullName", model: "User" },
        model: "Teacher",
      })
      .populate({
        path: "subjects.students.studentId",
        select: "userId",
        populate: { path: "userId", select: "fullName", model: "User" },
        model: "Student",
      })
      .lean();

    coordinatorData = allClassMarks.map(transformClassMarks);

    resource = await SchoolResource.findOne({ class: teacher.classCoordinator, schoolId: req.school?._id })
      .select("subjects.subjectName -_id")
      .lean();
  }

  // ---------- CLEAN TEACHER DATA ----------
  if (teacherMarks && teacherMarks.length)
    teacherMarks = cleanTeacherMarks(teacherMarks, teacher._id);

  if (classTeacherData && classTeacherData.length)
    classTeacherData = cleanClassTeacherMarks(classTeacherData);

  const subjectNames = resource?.subjects?.map((s) => s.subjectName) || [];


  res.status(200).json(
    new ApiResponse(
      200,
      {exams,previousMarkings: teacherMarks,classTeacherData,subjectNames,coordinatorData,},
      "Teacher marks data fetched successfully"
    ));
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

  const transformed = transformClassMarks(classMarks);

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
    (await StudentMarks.find({ studentId: req.student?._id, isPublished: true })
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
      .json(new ApiResponse(404, [], "No results Available Yet"));
  }

  // If class is below 8 → return grades for each exam with percentage
  if (req.student.class < 8) {
    const gradesData = marks.map((exam) => {
      const totalObtained = exam.marks.reduce((sum, m) => sum + m.marksObtained, 0);
      const totalMarks = exam.marks.reduce((sum, m) => sum + m.totalMarks, 0);
      const percentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2) : 0;

      return {
        id: exam._id,
        examId: exam.examId,
        percentage, 
        grades: exam.marks.map((m) => ({
          subject: m.subject,
          grade: getGrade(m.marksObtained, m.totalMarks),
          markedBy: { userId: { fullName: m.markedBy?.userId?.fullName || "N/A" } },
        })),
      };
    });

    return res
      .status(200)
      .json(new ApiResponse(200, gradesData, "Grades fetched successfully"));
  }

  // Else → return marks with percentage
  const marksWithPercentage = marks.map((exam) => {
    const totalObtained = exam.marks.reduce((sum, m) => sum + m.marksObtained, 0);
    const totalMarks = exam.marks.reduce((sum, m) => sum + m.totalMarks, 0);
    const percentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2) : 0;

    return {
      id: exam._id,
      examId: exam.examId,
      percentage, 
      marks: exam.marks,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, marksWithPercentage, "Student marks fetched successfully"));
});

/**
 * @desc Toggle publish/unpublish marks for a particular exam for a class
 * @route POST /api/v1/marks/toggle-publish-exam-result
 * @access Private (Class Coordinator of that particular class / SuperAdmin) 
 */
export const togglePublishExamResult = asyncHandler(async (req, res) => {
  const { examId, className, div } = req.body;
  const schoolId = req.school._id;

  // Only Super Admin or class coordinator can toggle
  if (req.user.role === "teacher" && req.teacher?.classCoordinator !== className) {
    throw new ApiError(403, "You are not allowed to publish/unpublish marks for this class");
  }

  const resource = await SchoolResource.findOne({ class: className })
    .select("subjects.subjectName -_id")
    .lean();

  const classMarks = await ClassMarks.findOne({ examId, class: className, div });

  if (!classMarks) {
    throw new ApiError(404, "Marks not found for this class and exam");
  }

  // If currently unpublished, check if all subjects are marked
  if (!classMarks.isPublished) {
    const markedSubjects = classMarks.subjects.map((s) => s.subject);
    const allSubjectsMarked = resource.subjects.every((sub) =>
      markedSubjects.includes(sub.subjectName)
    );

    if (!allSubjectsMarked) {
      throw new ApiError(400, "All subjects must be marked before publishing!");
    }
  }

  // Toggle the publish status
  classMarks.isPublished = !classMarks.isPublished;
  await classMarks.save();

  await StudentMarks.updateMany(
    { examId, class: className, div, schoolId },
    { $set: { isPublished: classMarks.isPublished } }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { isPublished: classMarks.isPublished },
      classMarks.isPublished
        ? "Marks published successfully"
        : "Marks unpublished successfully"
    )
  );
});

/**
 * @desc Get marks for a particular student for a particular exam
 * @param {String} examId _id of the exam
 * @param {String} studentId _id of the student
 * @param {String} schoolId _id of the school
 * @returns 
 */
export const getMarks = async (examId, studentId, schoolId) => {
  const marksRecord = await StudentMarks.findOne({ examId, studentId, schoolId });
  if (!marksRecord) return [];

  return marksRecord.marks.map(m => ({
    name: m.subject,
    marks: m.marksObtained,
    total: m.totalMarks
  }));
};


/**
 * @desc Export Marksheet for a particular exam for a particular student
 * @route POST /api/v1/marks/export-exam-marksheet
 * @access Private (Student)
 */
export const renderExamMarksheet = asyncHandler(async (req, res) => {
  const templatePath = "src/templates/examMarksheet.template.ejs";
  let { examId } = req.body;
  const school = req.school;
  const student = req.student;

  if (!student) throw new ApiError(400, "Student not found");
  if (!examId) throw new ApiError(400, "Exam not found");

  const exam = await Exam.findById(examId);
  if (!exam) throw new ApiError(400, "Exam not found");

  const examName = exam.name;

  // Attendance
  const { workingDays, daysPresent } = await getAttendanceSummary(
    school._id,
    student.class,
    student.div,
    student._id
  );

  // Marks + Grade
  let marks = await getMarks(examId, student._id, school._id);

  marks = marks.map(m => {
    if (m.marks !== undefined && m.total !== undefined) {
      return {
        ...m,
        displayMarks: `${m.marks} / ${m.total}`,
        grade: getGrade(m.marks, m.total),
      };
    }
    return {
      ...m,
      displayMarks: "-",
      grade: m.grade ?? "N/A",
    };
  });

  const data = {
    schoolName: school.name,
    logo: school.logo || "",
    examName,
    academicYear: (await getSettingValue("academicYear", school._id)) || "20xx-20xx",
    date: new Date().toLocaleDateString(),
    student: {
      name: req.user.fullName,
      // rollNo: student.rollNo ?? 0,
      _id: student._id,
      class: student.class,
      div: student.div,
      dob: student.dob ? new Date(student.dob).toLocaleDateString() : "Not Specified",
      workingDays,
      daysPresent,
      remarks: "Good"
    },
    marks
  };

  try {
    const html = await ejs.renderFile(templatePath, data);
    const file = { content: html };
    const options = {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const pdfBuffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${examName}-Marksheet.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    throw new ApiError(500, "Error generating PDF: " + err.message);
  }
});

/**
 * @desc Export consolidated Marksheet for the year
 * @route POST /marks/consolidated-markshet
 * @access Private (Student)
 */
export const renderConsolidatedMarksheet = asyncHandler(async (req, res) => {
  const templatePath = "src/templates/consolidatedMarksheet.template.ejs";
  const school = req.school;
  const student = req.student;

  if (!student) throw new ApiError(400, "Student not found");

  // 1. Fetch all exams for the school
  const exams = await Exam.find({ schoolId: school._id }).sort({ createdAt: 1 });

  if (!exams || exams.length === 0) {
    throw new ApiError(400, "No exams found for this school");
  }

  // 2. Collect marks for each subject across all exams
  let subjectsMap = {};

  for (const exam of exams) {
    const marks = await getMarks(exam._id, student._id, school._id);

    if (!marks || marks.length === 0) {
      throw new ApiError(400, `Consolidated marksheet not available yet`);
    }

    marks.forEach(m => {
      if (!subjectsMap[m.name]) {
        subjectsMap[m.name] = {
          subject: m.name,
          exams: {},
          totalObtained: 0,
          totalMax: 0
        };
      }

      if (m.marks !== undefined && m.total !== undefined) {
        subjectsMap[m.name].exams[exam.name] = {
          obtained: m.marks,
          total: m.total
        };
        subjectsMap[m.name].totalObtained += m.marks;
        subjectsMap[m.name].totalMax += m.total;
      }
    });
  }

  // 3. Convert total into 100 scale and grade
  const subjects = Object.values(subjectsMap).map(sub => {
    let percentage = (sub.totalObtained / sub.totalMax) * 100;
    return {
      ...sub,
      finalPercent: percentage.toFixed(2),
      grade: getGrade(sub.totalObtained, sub.totalMax)
    };
  });

  // 4. Attendance
  const { workingDays, daysPresent } = await getAttendanceSummary(
    school._id,
    student.class,
    student.div,
    student._id
  );

  const data = {
    schoolName: school.name,
    logo: school.logo || "",
    academicYear: (await getSettingValue("academicYear", school._id)) || "20xx-20xx",
    date: new Date().toLocaleDateString(),
    examHeaders: exams.map(e => e.name), // for dynamic table headers
    student: {
      _id: student._id,
      name: req.user.fullName,
      class: student.class,
      div: student.div,
      dob: student.dob ? new Date(student.dob).toLocaleDateString() : "Not Specified",
      workingDays,
      daysPresent,
      remarks: "Good"
    },
    subjects
  };

  try {
    const html = await ejs.renderFile(templatePath, data);
    const file = { content: html };
    const options = {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const pdfBuffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=consolidated_marksheet.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    throw new ApiError(500, "Error generating PDF: " + err.message);
  }
});
