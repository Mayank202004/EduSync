import React, { useState } from "react";
import { CircularProgress } from "@/components/UI/CircularProgressPercentage";
import Modal from "@/components/Modals/Modal";

function MyClass({ classTeacherData, subjectNames }) {
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const selectedExam = classTeacherData[selectedExamIndex] || {};
  const subjects = selectedExam?.subjects || [];
  const selectedSubject = subjects[selectedSubjectIndex] || null;

  // For Circular Progress
  const totalSubjects = subjectNames.length;
  const gradedCount = subjects.length;

  const progressTitle = `Marked ${gradedCount} out of ${totalSubjects} subjects`;

  return (
    <div className="p-4 bg-white dark:bg-customDarkFg rounded-2xl shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4">My Class Marks</h2>

      <div className="flex gap-6 items-center mb-4">
        {/* Exam Selector */}
        <div className="flex gap-2">
          <label className="font-medium">Select Term:</label>
          <select
            value={selectedExamIndex}
            onChange={(e) => {
              setSelectedExamIndex(Number(e.target.value));
              setSelectedSubjectIndex(0);
            }}
            className="border p-2 rounded dark:border-gray-400 dark:bg-customDarkFg"
          >
            {classTeacherData.map((exam, index) => (
              <option key={exam._id} value={index}>
                {exam.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selector */}
        <div className="flex gap-2">
          <label className="font-medium">Select Subject:</label>
          <select
            value={selectedSubjectIndex}
            onChange={(e) => setSelectedSubjectIndex(Number(e.target.value))}
            className="border p-2 rounded dark:border-gray-400 dark:bg-customDarkFg"
          >
            {subjects.map((subj, index) => (
              <option key={index} value={index}>
                {subj.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Circular Progress */}
        <div className="cursor-pointer" onClick={() => setShowModal(true)}>
          <CircularProgress
            value={gradedCount}
            max={totalSubjects}
            titleText={progressTitle}
          />
        </div>
      </div>

      {/* Exam Info */}
      <div className="mb-4">
        <p>
          <strong>Result Status:</strong>{" "}
          {selectedExam.isPublished ? (
            <span className="text-green-600">Published</span>
          ) : (
            <span className="text-red-600">Not Published</span>
          )}
        </p>
      </div>

      {/* Graded By Info */}
      {selectedSubject && selectedSubject.gradedBy && (
        <div className="mb-4">
          <p>
            <strong>Graded By:</strong> {selectedSubject.gradedBy.name}
          </p>
        </div>
      )}

      {/* Marks Table */}
      {selectedSubject ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-customDarkFg">
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">Marks Obtained</th>
              <th className="border px-4 py-2">Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {selectedSubject.students.map((student) => (
              <tr key={student.studentId}>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.marksObtained}</td>
                <td className="border px-4 py-2">{student.totalMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No subjects available for this term.</p>
      )}

      {/* Modal for Subject Status */}
      {showModal && (
        <Modal title="Subject Marking Status" onClose={() => setShowModal(false)}>
          <ul className="space-y-2">
            {subjectNames.map((subj) => {
              const graded = subjects.find((s) => s.subject === subj);
              return (
                <li
                  key={subj}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span className="font-medium">{subj}</span>
                  {graded ? (
                    <span className="text-green-600 text-sm">
                      Marked by {graded.gradedBy.name}
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm">Pending</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </div>
  );
}

export default MyClass;
