import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/Modals/Modal";
import ConfirmActionModal from "@/components/Modals/ConfirmationActionModal";
import {
  CalendarDays,
  ChevronLeft,
  Pencil,
  Trash2,
  Shuffle,
  Upload,
} from "lucide-react";

const dummyStudents = [
  { _id: "1", fullName: "Alice Johnson" },
  { _id: "2", fullName: "Bob Smith" },
  { _id: "3", fullName: "Charlie Brown" },
];

const ManageAcademicYear = ({ onBackPressed }) => {
  const [year, setYear] = useState("2024-25");
  const [editing, setEditing] = useState(false);
  const [newYear, setNewYear] = useState("2024-25");

  const [showClearModal, setShowClearModal] = useState(false);
  const [clearOptions, setClearOptions] = useState({
    attendance: false,
    marks: false,
    messages: false,
  });

  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [divisionMap, setDivisionMap] = useState({});

  const [activeSection, setActiveSection] = useState("dashboard");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'promote' | 'shuffle'

  const classOptions = ["Class 1", "Class 2", "Class 3"];
  const divisionOptions = ["A", "B", "C"];

  const handleUpdateYear = () => {
    if (!newYear.trim()) return toast.error("Academic year cannot be empty.");
    setYear(newYear);
    toast.success("Academic year updated!");
    setEditing(false);
  };

  const handleClearData = () => {
    const selected = Object.keys(clearOptions).filter((k) => clearOptions[k]);
    if (!selected.length) return toast.error("Select something to clear");
    toast.success("Data cleared: " + selected.join(", "));
    setShowClearModal(false);
  };

  const handleDivisionChange = (id, division) => {
    setDivisionMap((prev) => ({ ...prev, [id]: division }));
  };

  const handleConfirm = () => {
    if (confirmType === "promote") {
      toast.success("Students promoted!");
    } else if (confirmType === "shuffle") {
      toast.success("Divisions shuffled!");
    }
    setShowConfirm(false);
    setConfirmType(null);
  };

  useEffect(() => {
    if (selectedClass) {
      setStudents(dummyStudents);
    }
  }, [selectedClass]);

  const goBack = () => {
    setActiveSection("dashboard");
    setSelectedClass("");
    setStudents([]);
    setDivisionMap({});
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-600" /> Academic Year Settings
        </h2>
        <button
          onClick={onBackPressed}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {activeSection === "dashboard" && (
        <>
          {/* Year section */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">📅 Current Academic Year</h3>
            {editing ? (
              <div className="flex gap-3 items-center">
                <input
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 text-black w-40"
                  placeholder="e.g., 2025-26"
                />
                <button
                  onClick={handleUpdateYear}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center text-xl">
                <span>{year}</span>
                <button
                  onClick={() => {
                    setNewYear(year);
                    setEditing(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Pencil size={16} /> Edit
                </button>
              </div>
            )}
          </div>

          {/* Action Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => {
                setConfirmType("promote");
                setShowConfirm(true);
              }}
              className="cursor-pointer h-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-6 rounded-xl shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition flex flex-col justify-between"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                <Upload size={20} /> Promote Students
              </h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Move students to the next class for the new academic year.
              </p>
            </div>

            <div
              onClick={() => {
                setConfirmType("shuffle");
                setShowConfirm(true);
              }}
              className="cursor-pointer h-full bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 p-6 rounded-xl shadow hover:bg-purple-100 dark:hover:bg-purple-900 transition flex flex-col justify-between"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2 text-purple-700">
                <Shuffle size={20} /> Shuffle Divisions
              </h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Automatically shuffle students into new divisions.
              </p>
            </div>

            <div
              onClick={() => setShowClearModal(true)}
              className="cursor-pointer h-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-6 rounded-xl shadow hover:bg-red-100 dark:hover:bg-red-900 transition flex flex-col justify-between"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                <Trash2 size={20} /> Clear Old Data
              </h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Wipe attendance, marks, or messages from last year.
              </p>
            </div>

            <div
              onClick={() => setActiveSection("manual")}
              className="cursor-pointer h-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-6 rounded-xl shadow hover:bg-green-100 dark:hover:bg-green-900 transition flex flex-col justify-between"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2 text-green-700">
                🧑‍🏫 Manual Division Allotment
              </h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Manually assign students to divisions for each class.
              </p>
            </div>
          </div>
        </>
      )}

      {activeSection === "manual" && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4">🧑‍🏫 Manual Division Allotment</h3>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full text-black"
            >
              <option value="">-- Select --</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {students.length > 0 && (
            <table className="w-full text-left mt-4 border-t border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-2 px-3">Student</th>
                  <th className="py-2 px-3">Division</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu._id} className="border-t border-gray-200 dark:border-gray-600">
                    <td className="py-2 px-3">{stu.fullName}</td>
                    <td className="py-2 px-3">
                      <select
                        value={divisionMap[stu._id] || ""}
                        onChange={(e) =>
                          handleDivisionChange(stu._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded text-black w-full"
                      >
                        <option value="">-- Select --</option>
                        {divisionOptions.map((div) => (
                          <option key={div} value={div}>
                            {div}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button onClick={goBack} className="mt-6 text-sm underline text-gray-600">
            Back
          </button>
        </div>
      )}

      {showClearModal && (
        <Modal title="🧹 Clear Data Options" onClose={() => setShowClearModal(false)}>
          <div className="space-y-4">
            {Object.keys(clearOptions).map((key) => (
              <label key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={clearOptions[key]}
                  onChange={(e) =>
                    setClearOptions((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleClearData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="border px-4 py-2 rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showConfirm && (
        <ConfirmActionModal
          title={
            confirmType === "promote"
              ? "Confirm Promotion"
              : "Confirm Division Shuffle"
          }
          message={
            confirmType === "promote"
              ? "Are you sure you want to promote all students? This action is final."
              : "Are you sure you want to shuffle divisions? This action is final."
          }
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default ManageAcademicYear;
