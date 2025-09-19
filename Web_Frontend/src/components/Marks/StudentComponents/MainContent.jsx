import { Download, BarChart2 } from "lucide-react";
import MainContentSkeleton from "./MainContentSkeleton";

function MainContent({ student, activeIndex, exams, loading}) {
  const selectedExam = exams[activeIndex - 1];

  const totalObtained = selectedExam?.marks
    ? selectedExam.marks.reduce((sum, m) => sum + m.marksObtained, 0)
    : 0;

  const totalMarks = selectedExam?.marks
    ? selectedExam.marks.reduce((sum, m) => sum + m.totalMarks, 0)
    : 0;

  const percentage =
    selectedExam?.marks && totalMarks > 0
      ? ((totalObtained / totalMarks) * 100).toFixed(2)
      : 0;

  if (loading)
    return <MainContentSkeleton activeIndex={activeIndex} />

  return (
    <div className="w-full md:w-[75%] lg:w-[80%] space-y-6 overflow-y-auto">
      {/* Student Info */}
      <div className="flex justify-between items-center mt-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {student.name}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Class {student.class} - {student.division}
          </p>
        </div>
        {activeIndex > 0 && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <Download size={18} /> Export Marksheet
          </button>
        )}
      </div>

      {/* Home / Graphs */}
      {activeIndex === 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Performance Overview
          </h2>
          <div className="flex justify-center items-center h-64 text-gray-400 dark:text-gray-500">
            <BarChart2 size={64} className="animate-bounce" />
            <span className="ml-4">Graph of marks across exams here</span>
          </div>
        </div>
      )}

      {/* Selected Exam */}
      {activeIndex > 0 && selectedExam && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {selectedExam.examId.name || "Exam"}
          </h2>

          {/* Marks table */}
          {selectedExam.marks && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-3 border-b">Subject</th>
                      <th className="p-3 border-b">Marks Obtained</th>
                      <th className="p-3 border-b">Total Marks</th>
                      <th className="p-3 border-b">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExam.marks.map((m, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800"
                      >
                        <td className="p-3 border-b">{m.subject}</td>
                        <td className="p-3 border-b">{m.marksObtained}</td>
                        <td className="p-3 border-b">{m.totalMarks}</td>
                        <td className="p-3 border-b">
                          {((m.marksObtained / m.totalMarks) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center">
                <p className="font-semibold">
                  Total Marks: {totalObtained} / {totalMarks}
                </p>
                <p className="font-semibold">Percentage: {percentage}%</p>
              </div>
            </>
          )}

          {/* Grades table */}
          {selectedExam.grades && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-3 border-b">Subject</th>
                    <th className="p-3 border-b">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExam.grades.map((g, idx) => (
                    <tr
                      key={idx}
                      className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800"
                    >
                      <td className="p-3 border-b">{g.subject}</td>
                      <td className="p-3 border-b">{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MainContent;
