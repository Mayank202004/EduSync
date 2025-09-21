// To DO: Change this static logic to dynamic based on schools (Each school can have its own grading system so creat a mode lwhere super admin can modify grading syste muse default grading system as this ) 

export const getGrade = (marksObtained, totalMarks) => {
  const percentage = (marksObtained / totalMarks) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "E";
};

/**
 * @desc Clean Class Teacher Marks
 * @param {Object} classTeacherMarks - Class Marks Fetched for a class teacher
 * @returns {Object} - Cleaned Class Teacher Marks
 */
export const cleanClassTeacherMarks = (classTeacherMarks) => {
  return classTeacherMarks.map(ctm => ({
    _id: ctm._id,
    name: ctm.examId.name,
    isPublished: ctm.isPublished,
    subjects: ctm.subjects.map(subj => ({
      subject: subj.subject,
      students: subj.students.map(stu => ({
        studentId: stu.studentId?._id,
        name: stu.studentId?.userId?.fullName,
        marksObtained: stu.marksObtained,
        totalMarks: stu.totalMarks,
      })),
      gradedBy: subj.gradedBy
        ? {
            teacherId: subj.gradedBy._id,
            name: subj.gradedBy.userId?.fullName,
          }
        : null,
    })),
  }));
}

/**
 * @desc Clean Teacher Marks
 * @param {Object} teacherMarks - Class Marks for all classes, divisions and subjects the teacher is teaching 
 * @returns {Object} - Cleaned Teacher Marks
 */
export const cleanTeacherMarks=(teacherMarks, teacherId) => {
  const examMap = new Map();

  teacherMarks.forEach((sm) => {
    const examName = sm.examId?.name;
    if (!examName) return;

    if (!examMap.has(examName)) {
      examMap.set(examName, { _id: sm.examId._id, name: examName, subjects: [] });
    }

    const examObj = examMap.get(examName);

    sm.marks.forEach((mark) => {
      if (String(mark.markedBy) !== String(teacherId)) return;

      // check if subject exists, else add
      let subjectObj = examObj.subjects.find((s) => s.name === mark.subject);
      if (!subjectObj) {
        subjectObj = { name: mark.subject, classes: [] };
        examObj.subjects.push(subjectObj);
      }

      // check if class exists, else add
      let classObj = subjectObj.classes.find((c) => c.class === sm.studentId.class);
      if (!classObj) {
        classObj = { class: sm.studentId.class, divs: [] };
        subjectObj.classes.push(classObj);
      }

      // check if div exists, else add
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

  return Array.from(examMap.values());
}

/**
 * @desc Cleans and organises class marks data
 * @param {Object} classMarks 
 * @returns Return organised class Marks
 */
export const transformClassMarks = (classMarks) => {
  if (!classMarks) return null;

  return {
    exam: classMarks.examId?.name || undefined, // only if examId is populated
    class: classMarks.class,
    div: classMarks.div,
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
};
