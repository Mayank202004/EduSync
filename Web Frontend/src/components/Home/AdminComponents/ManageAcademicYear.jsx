import React, { useEffect, useState } from "react";
import {
  fetchAcademicYear,
  updateAcademicYear,
  promoteStudents,
  shuffleDivisions,
  clearOldData,
} from "@/services/dashboardService";
import Modal from "@/components/Modals/Modal";
import toast from "react-hot-toast";

const ManageAcademicYear = ({ onBackPressed }) => {
  const [year, setYear] = useState("");
  const [editing, setEditing] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAcademicYear();
        setYear(res.data?.year || "2024-25");
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdateYear = async () => {
    if (!newYear.trim()) {
      toast.error("Academic year cannot be empty.");
      return;
    }
    try {
      await toast.promise(updateAcademicYear(newYear), {
        loading: "Updating year...",
        success: "Academic year updated!",
        error: "",
      });
      setYear(newYear);
      setEditing(false);
    } catch {}
  };

  const handlePromote = async () => {
    try {
      await toast.promise(promoteStudents(), {
        loading: "Promoting students...",
        success: "Promotion complete!",
        error: "",
      });
    } catch {}
  };

  const handleShuffle = async () => {
    try {
      await toast.promise(shuffleDivisions(), {
        loading: "Shuffling divisions...",
        success: "Divisions shuffled!",
        error: "",
      });
    } catch {}
  };

  const handleClearData = async () => {
    try {
      await toast.promise(clearOldData(), {
        loading: "Clearing old data...",
        success: "Old data cleared!",
        error: "",
      });
    } catch {}
  };

  return (
    <div className="text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Academic Year</h2>
        <button
          onClick={onBackPressed}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Loading academic year...</p>
      ) : (
        <div className="mb-6 p-5 rounded-xl bg-white dark:bg-customDarkFg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
              Current Academic Year:
            </h3>
            {editing ? (
              <div className="flex gap-2 items-center">
                <input
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="px-3 py-1 border rounded text-black"
                  placeholder="e.g., 2025-26"
                />
                <button
                  onClick={handleUpdateYear}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <span className="text-lg">{year}</span>
                <button
                  onClick={() => {
                    setNewYear(year);
                    setEditing(true);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={handlePromote}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Promote All Students
        </button>
        <button
          onClick={handleShuffle}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Shuffle Divisions
        </button>
        <button
          onClick={handleClearData}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Clear Old Data
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Note:</strong> These actions impact the structure of your
          academic data. Promotion will move all students to the next class, and
          old class records will be retained unless cleared manually.
        </p>
      </div>
    </div>
  );
};

export default ManageAcademicYear;
