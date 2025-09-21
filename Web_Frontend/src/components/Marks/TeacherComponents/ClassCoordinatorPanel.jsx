import React, { useState } from "react";
import Modal from "@/components/Modals/Modal";
import { CircularProgress } from "@/components/UI/CircularProgressPercentage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import toast from "react-hot-toast";
import ConfirmActionModal from "@/components/Modals/ConfirmationActionModal";
import { calculateNormalDistribution, transformAndSortMarks } from "@/utils/marksUtils";
import { togglePublishExamResult } from "@/services/marksServices";


const ClassCoordinatorPanel = ({ coordinatorData, subjectNames }) => {
  const exams = [...new Set(coordinatorData.map((d) => d.exam))];

  const [selectedExam, setSelectedExam] = useState(exams[0] ?? "");
  const [selectedDiv, setSelectedDiv] = useState(
    coordinatorData.find((d) => d.exam === selectedExam)?.div ?? ""
  );
  const [selectedSubject, setSelectedSubject] = useState(
    coordinatorData.find((d) => d.exam === selectedExam && d.div === selectedDiv)
      ?.subjects[0]?.subject ?? ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "roll", direction: "asc" });
  const [showModal, setShowModal] = useState(false);

  const marksData = coordinatorData.find(
    (d) => d.exam === selectedExam && d.div === selectedDiv
  );

  const [isPublished, setIsPublished] = useState(marksData?.isPublished === true || marksData?.isPublished === "true");
  const [confirmModal, setConfirmModal] = useState(null);

  const subjectData = marksData?.subjects.find(
    (sub) => sub.subject === selectedSubject
  );

  const studentMarks = subjectData
    ? subjectData.students.map((s, idx) => ({
        name: s.fullName,
        roll: idx + 1,
        marks: s.marksObtained,
        total: s.totalMarks,
      }))
    : [];

  const sortedMarks = transformAndSortMarks(studentMarks, sortConfig);

  const gradedSubjects = marksData?.subjects.map((s) => s.subject) ?? [];
  const gradedCount = gradedSubjects.length;
  const totalSubjects = subjectNames.length;
  const progressTitle = `${gradedCount}/${totalSubjects} subjects marked`;

  const togglePublishStatus = () => {
    if (!isPublished) {
      if (gradedCount < totalSubjects) {
        toast.error("All subjects must be marked before publishing!");
        return;
      }
    }
    setConfirmModal({
      title: isPublished ? "Unpublish Results?" : "Publish Results?",
      message: isPublished
        ? "Are you sure you want to unpublish the results?"
        : "Are you sure you want to publish the results?",
      action: async () => {
        setConfirmModal(null); // close modal first
        try {
          await toast.promise(
            togglePublishExamResult(marksData.examId, marksData.class, selectedDiv),
            {
              loading: isPublished ? "Unpublishing..." : "Publishing...",
              success: (res) => {
                setIsPublished(!isPublished);
                return isPublished
                  ? "Results unpublished successfully!"
                  : "Results published successfully!";
              },
              error: "",
            }
          );
        } catch (err) {
          // Error handled by axios interceptor
        }
      },
    });
  };

  return (
    <div className="flex-1 px-8 pt-8 space-y-8 overflow-x-auto h-full w-full">
      {/* Exam + Div selection */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedExam}
          onChange={(e) => {
            setSelectedExam(e.target.value);
            const newDiv =
              coordinatorData.find((d) => d.exam === e.target.value)?.div ?? "";
            setSelectedDiv(newDiv);
            setSelectedSubject(
              coordinatorData.find(
                (d) => d.exam === e.target.value && d.div === newDiv
              )?.subjects[0]?.subject ?? ""
            );
          }}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          {exams.map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>

        <select
          value={selectedDiv}
          onChange={(e) => {
            setSelectedDiv(e.target.value);
            setSelectedSubject(
              coordinatorData.find(
                (d) => d.exam === selectedExam && d.div === e.target.value
              )?.subjects[0]?.subject ?? ""
            );
          }}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          {coordinatorData
            .filter((d) => d.exam === selectedExam)
            .map((d) => (
              <option key={d.div} value={d.div}>
                Div {d.div}
              </option>
            ))}
        </select>
      </div>

      {!marksData ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No data available for selected exam/div</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {selectedExam} - Class {marksData.class} Div {selectedDiv}
            </h2>
            <div className="flex items-center gap-4">
              <CircularProgress
                value={gradedCount}
                max={totalSubjects}
                onClick={() => setShowModal(true)}
                titleText={progressTitle}
              />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm dark:bg-customDarkFg"
              >
                {marksData.subjects.map((sub) => (
                  <option key={sub.subject} value={sub.subject}>
                    {sub.subject}
                  </option>
                ))}
              </select>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  isPublished
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-white hover:bg-gray-500"
                }`}
                onClick={togglePublishStatus}
              >
                {isPublished ? "Published" : "Unpublished"}
              </button>
            </div>
          </div>

          {/* Summary + Graph */}
          <div className="flex gap-4">
            <div className="grid grid-cols-1 gap-4 w-[30%]">
              <div className="p-6 bg-white dark:bg-customDarkFg shadow rounded-xl text-center">
                <p className="text-sm text-gray-500 dark:text-gray-200">
                  Class Average
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {studentMarks.length > 0
                    ? (
                        (studentMarks.reduce((a, b) => a + b.marks, 0) /
                          studentMarks.reduce((a, b) => a + b.total, 0)) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-customDarkFg shadow rounded-xl text-center">
                <p className="text-sm text-gray-500 dark:text-gray-200">
                  Teacher
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {subjectData?.gradedBy}
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-customDarkFg shadow rounded-xl text-center">
                <p className="text-sm text-gray-500 dark:text-gray-200">
                  Total Marks
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {studentMarks[0]?.total ?? "-"}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-customDarkFg shadow rounded-xl p-6 w-[70%]">
              <h3 className="text-lg font-semibold mb-4">
                Normal Distribution of Marks
              </h3>
              {(() => {
                const percentages = studentMarks.map(
                  (s) => (s.marks / s.total) * 100
                );
                const { data, mean } = calculateNormalDistribution(percentages);
                return (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data}>
                      <XAxis dataKey="x" />
                      <YAxis hide />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#3b82f6"
                        dot={false}
                        strokeWidth={2}
                      />
                      <ReferenceLine
                        x={mean}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{
                          value: `Mean: ${mean.toFixed(1)}%`,
                          position: "top",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-customDarkFg shadow rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Scores</h3>
              <div className="flex items-center gap-3">
                <select
                  value={sortConfig.key}
                  onChange={(e) =>
                    setSortConfig({ key: e.target.value, direction: "asc" })
                  }
                  className="border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="roll">Sort by Roll No</option>
                  <option value="rank">Sort by Rank</option>
                </select>
                <input
                  type="text"
                  placeholder="Search by name or roll..."
                  className="border px-3 py-2 rounded-lg text-sm w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="min-h-[70px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-customDarkBg text-gray-700">
                  <tr className="dark:text-white">
                    <th className="p-3 border">Student</th>
                    <th className="p-3 border">Roll No</th>
                    <th className="p-3 border">Marks</th>
                    <th className="p-3 border">Percentage</th>
                    <th className="p-3 border">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMarks
                    .filter(
                      (s) =>
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.roll.toString().includes(searchTerm)
                    )
                    .map((s) => (
                      <tr
                        key={s.roll}
                        className="hover:bg-gray-50 dark:hover:bg-customDarkBg transition text-gray-800 dark:text-gray-200"
                      >
                        <td className="p-3 border">{s.name}</td>
                        <td className="p-3 border">{s.roll}</td>
                        <td className="p-3 border">{s.marks}</td>
                        <td className="p-3 border">{s.percentage.toFixed(0)}%</td>
                        <td className="p-3 border">{s.rank}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <Modal title="Subject Marking Status" onClose={() => setShowModal(false)}>
          <ul className="space-y-2">
            {subjectNames.map((subj) => {
              const graded = marksData?.subjects.find((s) => s.subject === subj);
              return (
                <li
                  key={subj}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span className="font-medium">{subj}</span>
                  {graded ? (
                    <span className="text-green-600 text-sm">
                      Marked by {graded.gradedBy}
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

      {confirmModal && (
        <ConfirmActionModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.action}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};

export default ClassCoordinatorPanel;
