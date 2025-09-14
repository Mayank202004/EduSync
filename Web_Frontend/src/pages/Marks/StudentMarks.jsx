import React, { useState } from "react";
import { Download, BarChart2, FileSpreadsheet, Home } from "lucide-react";

function StudentMarks() {
  const student = {
    name: "John Doe",
    class: "10",
    division: "A",
    rollNo: "23",
  };

  // You may receive marks OR grades
  const exams = [
    {
      id: 1,
      name: "Term 1",
      date: "14 Sep 2025",
      marks: [
        { subject: "English", marksObtained: 33, totalMarks: 40 },
        { subject: "Maths", marksObtained: 38, totalMarks: 50 },
        { subject: "Science", marksObtained: 42, totalMarks: 50 },
      ],
    },
    {
      id: 2,
      name: "Unit Test",
      date: "20 Dec 2025",
      grades: [
        { subject: "English", grade: "A" },
        { subject: "Maths", grade: "B+" },
        { subject: "Science", grade: "A+" },
      ],
    },
    {
      id: 3,
      name: "Final Exam",
      date: "10 Mar 2026",
      marks: [
        { subject: "English", marksObtained: 38, totalMarks: 40 },
        { subject: "Maths", marksObtained: 45, totalMarks: 50 },
        { subject: "Science", marksObtained: 48, totalMarks: 50 },
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0); // 0 = Home

  const selectedExam = exams[activeIndex - 1]; // exams start from index 1

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

  return (
    <div className="flex h-[90vh] w-full bg-gray-50 dark:bg-gray-900 px-4 py-2">
      {/* Sidebar */}
      <div className="hidden md:block md:w-[25%] lg:w-[20%] pr-4">
        <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 dark:border dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6">Navigation</h2>
          <ul className="space-y-3">
            <li
              className={`flex items-center space-x-2 p-3 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${
                activeIndex === 0
                  ? "bg-blue-200 dark:bg-blue-800 font-semibold"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
              onClick={() => setActiveIndex(0)}
            >
              <Home size={18} />
              <span>Home</span>
            </li>
            {exams.map((exam, idx) => (
              <li
                key={exam.id}
                className={`flex items-center space-x-2 p-3 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${
                  activeIndex === idx + 1
                    ? "bg-blue-200 dark:bg-blue-800 font-semibold"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
                onClick={() => setActiveIndex(idx + 1)}
              >
                <FileSpreadsheet size={18} />
                <span>{exam.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[75%] lg:w-[80%] space-y-6 overflow-y-auto">
        {/* Student Info */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {student.name}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Class {student.class} - {student.division} | Roll No: {student.rollNo}
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
              {selectedExam.name} - {selectedExam.date}
            </h2>

            {/* If marks present */}
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
                          className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700"
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

            {/* If grades present */}
            {selectedExam.grades && (
              <div className="overflow-x-auto">
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
                        className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700"
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
    </div>
  );
}

export default StudentMarks;
