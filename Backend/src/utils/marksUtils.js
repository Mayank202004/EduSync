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
