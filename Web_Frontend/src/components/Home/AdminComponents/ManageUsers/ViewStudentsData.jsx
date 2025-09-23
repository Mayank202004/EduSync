import React, { useState } from "react";

// Dummy student data
const dummyStudents = [
  {
    _id: "1",
    fullName: "Abhinav Jaiswal",
    allergies: ["Thermocol", "Bee Wax"],
    parentsInfo: {
      address: "Satara",
      dob: "2011-03-24",
      bloodGroup: "B+",
      height: 152,
      weight: 30,
      schoolTransport: true,
      gender: "male",
    },
    parentContact: [
      { name: "Abhinav Jaiswal", relation: "Father", phone: "9856732345" },
    ],
  },
  {
    _id: "2",
    fullName: "Riya Sharma",
    allergies: [],
    parentsInfo: {
      address: "Pune",
      dob: "2010-05-12",
      bloodGroup: "O+",
      height: 148,
      weight: 35,
      schoolTransport: false,
      gender: "female",
    },
    parentContact: [
      { name: "Sunil Sharma", relation: "Father", phone: "9856743210" },
    ],
  },
];

// Component for full student details
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

      <p><strong>Full Name:</strong> {student.fullName}</p>
      <p><strong>Allergies:</strong> {student.allergies.join(", ") || "-"}</p>
      <p><strong>Address:</strong> {student.parentsInfo.address}</p>
      <p><strong>DOB:</strong> {student.parentsInfo.dob}</p>
      <p><strong>Blood Group:</strong> {student.parentsInfo.bloodGroup}</p>
      <p><strong>Height:</strong> {student.parentsInfo.height} cm</p>
      <p><strong>Weight:</strong> {student.parentsInfo.weight} kg</p>
      <p><strong>Gender:</strong> {student.parentsInfo.gender}</p>
      <p><strong>School Transport:</strong> {student.parentsInfo.schoolTransport ? "Yes" : "No"}</p>
      <p><strong>Parent Contact:</strong> {student.parentContact.map(p => `${p.name} (${p.relation}) - ${p.phone}`).join(", ")}</p>
    </div>
  );
}

function ViewStudentsData({ onBack }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = dummyStudents.filter(
    student => !searchTerm || student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If a student is selected, show StudentDetailsScreen
  if (selectedStudent) {
    return (
      <StudentDetailsScreen
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">View Students Data</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Class</option>
          {[1, 2, 3, 4, 10].map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <select
          value={selectedDiv}
          onChange={(e) => setSelectedDiv(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Div</option>
          {["A", "B", "C"].map(div => (
            <option key={div} value={div}>{div}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded">Export</button>
      </div>

      {/* Students Table */}
      <table className="min-w-full border border-gray-300">
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
              <td className="border px-4 py-2">{student.fullName}</td>
              <td className="border px-4 py-2">{student.allergies.join(", ") || "-"}</td>
              <td className="border px-4 py-2">
                {student.parentContact.map(p => `${p.name} (${p.relation})`).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStudentsData;
