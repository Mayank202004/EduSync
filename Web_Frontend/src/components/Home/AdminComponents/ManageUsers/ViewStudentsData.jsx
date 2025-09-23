import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllStudents } from "@/services/dashboardService";

function StudentDetailsScreen({ student, onBack }) {
  return (
    <div className="p-6 border rounded shadow bg-white">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Student Details</h2>
      <p><strong>Full Name:</strong> {student.userId.fullName}</p>
      <p><strong>Email:</strong> {student.userId.email}</p>
      <p><strong>Allergies:</strong> {student.allergies.join(", ") || "-"}</p>
      <p><strong>Address:</strong> {student.parentsInfo?.address || "-"}</p>
      <p><strong>DOB:</strong> {student.parentsInfo?.dob || "-"}</p>
      <p><strong>Blood Group:</strong> {student.parentsInfo?.bloodGroup || "-"}</p>
      <p><strong>Gender:</strong> {student.gender || student.parentsInfo?.gender || "-"}</p>
      <p><strong>School Transport:</strong> {student.parentsInfo?.schoolTransport ? "Yes" : "No"}</p>
      <p>
        <strong>Parent Contact:</strong>{" "}
        {student.parentContact?.map(p => `${p.name} (${p.relation}) - ${p.phone}`).join(", ") || "-"}
      </p>
    </div>
  );
}

function ViewStudentsData({ onBack }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsByDiv, setStudentsByDiv] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedClass) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await getAllStudents(selectedClass);
        setStudentsByDiv(response.data || {});
        setSelectedDiv(""); 
      } catch (err) {
        // Handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchStudents(); 
  }, [selectedClass]);

  // Filter students by division and search term
  const filteredStudents = selectedDiv
    ? (studentsByDiv[selectedDiv] || []).filter(student =>
        !searchTerm || student.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (selectedStudent) {
    return <StudentDetailsScreen student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">View Students Data</h1>

      {/* Dropdowns - always visible */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Class</option>
            {[1, 2, 3, 4, 10].map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Division</label>
          <select
            value={selectedDiv}
            onChange={(e) => setSelectedDiv(e.target.value)}
            className="border p-2 rounded"
            disabled={!selectedClass || !Object.keys(studentsByDiv).length}
          >
            <option value="">Select Division</option>
            {Object.keys(studentsByDiv).map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Table or messages */}
      {!selectedClass ? (
        <div className="text-gray-500 mt-4">Please select a class to view students</div>
      ) : loading ? (
        <div className="mt-4">Loading...</div>
      ) : !selectedDiv ? (
        <div className="text-gray-500 mt-4">Please select a division to view students</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-gray-500 mt-4">No students found</div>
      ) : (
        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Full Name</th>
              <th className="border px-4 py-2">Allergies</th>
              <th className="border px-4 py-2">Parent Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr
                key={student._id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedStudent(student)}
              >
                <td className="border px-4 py-2">{student.userId.fullName}</td>
                <td className="border px-4 py-2">{student.allergies.join(", ") || "-"}</td>
                <td className="border px-4 py-2">
                  {student.parentContact?.map(p => `${p.name} (${p.relation})`).join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewStudentsData;
