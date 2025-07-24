import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/Modals/Modal";
import ConfirmActionModal from "@/components/Modals/ConfirmationActionModal";
import {
  CalendarDays,
  Pencil,
  Trash2,
  Shuffle,
  Upload,
  ArrowLeft,
} from "lucide-react";
import {
  fetchManageAcademicYearData,
  updateAcademicYear,
  clearOldData,
  promoteStudents,
  shuffleDivisions,
} from "@/services/dashboardService";
import ManualDivisionAllotment from "./ManualDivisionAllotment";

const ManageAcademicYear = ({ onBackPressed }) => {
  const [year, setYear] = useState(null);
  const [newYear, setNewYear] = useState("");
  const [editing, setEditing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearOptions, setClearOptions] = useState({
    attendance: false,
    feeStatus: false,
    messages: false,
    tickets: false,
  });
  
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [classes, setClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const classOptions = classes.map((cls) => cls.className);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchManageAcademicYearData();
        setYear(response.data?.academicYear);
        setNewYear(response.data?.academicYear);
        setClasses(response.data?.classesAndDivs || []);
        setAllStudents(response.data?.students || []);
      } catch (err) {
        // Handled by interceptor
      }
    };
    loadData();
  }, []);

  const handleUpdateYear = async () => {
    if (!newYear.trim()) return toast.error("Academic year cannot be empty.");
    try {
      await toast.promise(updateAcademicYear(newYear), {
        loading: "Updating Academic Year...",
        success: "Academic Year Updated",
        error: "Failed to update year",
      });
      setYear(newYear);
      setEditing(false);
    } catch (err) {
      // Handled by interceptor
    }
  };

  const handleClearData = async () => {
    const { attendance, feeStatus, messages, tickets } = clearOptions;

    if (!attendance && !feeStatus && !messages && !tickets) {
      return toast.error("Select something to clear");
    }

    try {
      await toast.promise(
        clearOldData(attendance, feeStatus, messages, tickets),
        {
          loading: "Clearing Data...",
          success: "Selected data cleared successfully",
          error: "Failed to clear data",
        }
      );
      setShowClearModal(false);
    } catch (err) {
      // handled by interceptor
    }
  };


  const handlePromoteStudents = async () => {
    try {
      await toast.promise(promoteStudents(), {
        loading: "Promoting Students...",
        success: "Students promoted",
        error: "Promotion failed",
      });
    } catch (err) {}
  };

  const handleShuffleDivisions = async () => {
    try {
      await toast.promise(shuffleDivisions(), {
        loading: "Shuffling Divisions...",
        success: "Divisions shuffled",
        error: "Shuffle failed",
      });
    } catch (err) {}
  };

  const handleConfirm = async () => {
    if (confirmType === "promote") {
      await handlePromoteStudents();
    } else if (confirmType === "shuffle") {
      await handleShuffleDivisions();
    }
    setShowConfirm(false);
    setConfirmType(null);
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          Academic Year Settings
        </h2>
      </div>

      <button
        onClick={onBackPressed}
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {activeSection === "dashboard" && (
        <>
          <div className="bg-gray-50 dark:bg-customDarkFg border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm">
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
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Pencil size={16} /> Edit
                </button>
              </div>
            )}
          </div>

          {/* Action Boxes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => {
                setConfirmType("promote");
                setShowConfirm(true);
              }}
              className="cursor-pointer bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-6 rounded-xl shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition"
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
              className="cursor-pointer bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 p-6 rounded-xl shadow hover:bg-purple-100 dark:hover:bg-purple-900 transition"
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
              className="cursor-pointer bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-6 rounded-xl shadow hover:bg-red-100 dark:hover:bg-red-900 transition"
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
              className="cursor-pointer bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-6 rounded-xl shadow hover:bg-green-100 dark:hover:bg-green-900 transition"
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
        <ManualDivisionAllotment
          classes={classes}
          allStudents={allStudents}
          onBack={() => setActiveSection("dashboard")}
        />
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