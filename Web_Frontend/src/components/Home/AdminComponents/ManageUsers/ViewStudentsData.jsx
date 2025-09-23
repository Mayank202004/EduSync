import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllStudents, fetchAllClasses } from "@/services/dashboardService";
import StudentDetails from "./StudentDetails";

function ViewStudentsData({ onBack }) {
  const [classes, setClasses] = useState([]); // store classes and divisions
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsByDiv, setStudentsByDiv] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchAllClasses();
        setClasses(response.data || []);
      } catch (err) {
        // Handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students when class is selected
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

  // Get divisions for selected class
  const divisions =
    classes.find((cls) => cls.className === selectedClass)?.divisions || [];

  // Filter students by division and search term
  const filteredStudents = selectedDiv
    ? (studentsByDiv[selectedDiv] || []).filter((student) =>
        !searchTerm ||
        student.userId.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

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
      <div className="max-w-6xl mx-auto bg-white dark:bg-customDarkBg rounded-lg shadow-md p-6 h-full">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
        >
          ← Back to Manage Users
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">View Students Data</h1>

        {/* Filters */}
        <div className="flex items-end gap-4 mb-6 flex-wrap">
          {/* Left side: Class + Division */}
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

          {/* Right side: Search */}
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

        {/* Table or messages */}
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
                  <th className="border px-4 py-2 text-left">Allergies</th>
                  <th className="border px-4 py-2 text-left">Parent Contact</th>
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
                      {student.allergies?.length
                        ? student.allergies.join(", ")
                        : "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {student.parentContact?.length
                        ? student.parentContact
                            .map((p) => `${p.name} (${p.relation})`)
                            .join(", ")
                        : "-"}
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
