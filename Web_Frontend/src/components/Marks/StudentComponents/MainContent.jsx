import { Download, BarChart2 } from "lucide-react";
import MainContentSkeleton from "./MainContentSkeleton";
import toast from "react-hot-toast";
import { exportExamMarksheet } from "@/services/marksServices";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  const chartData =
    exams?.map((exam) => ({
      name: exam.examId?.name || "Exam",
      percentage: parseFloat(exam.percentage), 
    })) ?? [];

  const handleExportMarksheet = async (examId) => {
    await toast.promise(
      exportExamMarksheet(examId),
      {
        loading: "Generating marksheet...",
        success: "Marksheet downloaded successfully",
        error: "",
      }
    );
  };


  if (loading)
    return <MainContentSkeleton activeIndex={activeIndex} />

  return (
    <div className="w-full md:w-[75%] lg:w-[80%] space-y-6 overflow-y-auto">
      {/* Student Info */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-5 gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {student.name}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Class {student.class} - {student.division}
          </p>
        </div>
        {activeIndex > 0 && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleExportMarksheet(selectedExam.examId._id)}
          >
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

          {chartData.length >= 2 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#2563eb" // blue-600
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
              <div className="flex justify-center items-center h-64 text-gray-400 dark:text-gray-500">
                <BarChart2 size={64} className="animate-bounce" />
                <span className="ml-4">Graph of marks across exams will appear here - Currently Not enough exams to show performance graph</span>
            </div>
          )}
        </div>
      )}

      {/* Selected Exam */}
      {activeIndex > 0 && selectedExam && (
        <div className="p-2 md:p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h2 className="ml-2 md:ml-0 text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
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
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded flex flex-col md:flex-row justify-between items-center">
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
