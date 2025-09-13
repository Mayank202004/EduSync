/**
 * @desc Helper to check if a teacher teaches a subject in a given class and division 
 * @param {Object} teacher - Teacher object
 * @param {String} subjectName - Name of the subject
 * @param {String} className - Name of the class
 * @param {String} div - Division
 * @returns {Boolean} - True if the teacher teaches the subject in the class and division, false otherwise
 */
export const isTeacherAllowed = (teacher, subjectName, className, div) => {
  if (!teacher?.subjects) return false;

  const subject = teacher.subjects.find(s => s.name === subjectName);
  if (!subject) return false;

  const teachesClass = subject.classes.some(c => c.class === className && c.div.includes(div));
  return teachesClass;
};
