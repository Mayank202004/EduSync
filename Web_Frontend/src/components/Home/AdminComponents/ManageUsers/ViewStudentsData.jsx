import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllStudents, fetchAllClasses, exportStudentData } from "@/services/dashboardService";
import StudentDetails from "./StudentDetails";
import { formatDate } from "@/utils/dateUtils";

function ViewStudentsData({ onBack }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsByDiv, setStudentsByDiv] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch classes for dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchAllClasses();
        setClasses(response.data || []);
      } catch (err) {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (!selectedClass) return;
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await getAllStudents(selectedClass);
        setStudentsByDiv(response.data || {});
        setSelectedDiv("");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const divisions =
    classes.find((cls) => cls.className === selectedClass)?.divisions || [];

  const filteredStudents = selectedDiv
    ? (studentsByDiv[selectedDiv] || []).filter((student) =>
        !searchTerm ||
        student.userId.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle Export studnet data
  const handleExport = () => {
    toast.promise(
      exportStudentData(selectedClass, selectedDiv),
      {
        loading: "Exporting student data...",
        success: "Export completed!",
        error: "",
      }
    );
  };

  if (selectedStudent) {
    return (
      <StudentDetails
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div className="px-6 h-full">
      <div className="max-w-6xl mx-auto bg-white dark:bg-customDarkBg rounded-lg shadow-md p-6 min-h-full">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
        >
          ← Back to Manage Users
        </button>

        {/* Title + Export */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">View Students Data</h1>

          {selectedClass && selectedDiv && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Export Data
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-end gap-4 mb-6 flex-wrap">
          {/* Class + Division */}
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-700 dark:text-white mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border p-2 rounded dark:bg-customDarkFg dark:text-white"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white mb-1">
                Division
              </label>
              <select
                value={selectedDiv}
                onChange={(e) => setSelectedDiv(e.target.value)}
                className="border p-2 rounded dark:bg-customDarkFg dark:text-white"
                disabled={!selectedClass || divisions.length === 0}
              >
                <option value="">Select Division</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 ml-auto max-w-sm">
            <label className="block text-gray-700 dark:text-white mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full dark:bg-customDarkFg dark:text-white"
            />
          </div>
        </div>

        {/* Table / messages */}
        {!selectedClass ? (
          <div className="text-gray-500 mt-4">
            Please select a class to view students
          </div>
        ) : loading ? (
          <div className="mt-4">Loading...</div>
        ) : !selectedDiv ? (
          <div className="text-gray-500 mt-4">
            Please select a division to view students
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-gray-500 mt-4">No students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 dark:bg-customDarkFg">
                  <th className="border px-4 py-2 text-left">Full Name</th>
                  <th className="border px-4 py-2 text-left">DOB</th>
                  <th className="border px-4 py-2 text-left">Gender</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="border px-4 py-2">
                      {student.userId.fullName}
                    </td>
                    <td className="border px-4 py-2">
                      {student.dob ? formatDate(student.dob) : "Not Specified"}
                    </td>
                    <td className="border px-4 py-2">
                      {student.gender !="unspecified" ? student.gender : "Not Specified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStudentsData;
