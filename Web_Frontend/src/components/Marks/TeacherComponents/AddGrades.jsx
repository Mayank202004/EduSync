import React, { useState } from "react";
import { Upload, ClipboardList } from "lucide-react";

function AddGrades() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [students, setStudents] = useState([]);

  const subjects = ["Math", "Science", "English"];
  const classes = ["1", "2", "3"];
  const divisions = ["A", "B", "C"];

  // Dummy student data
  const dummyStudents = [
    { _id: "1", fullName: "John Doe" },
    { _id: "2", fullName: "Jane Smith" },
    { _id: "3", fullName: "Alex Johnson" },
  ];

  const handleFetchStudents = () => {
    setStudents(dummyStudents.map((s) => ({ ...s, marks: "" })));
  };

  const handleMarksChange = (id, value) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, marks: value } : s))
    );
  };

  const handleUploadXLSX = () => {
    alert("Upload XLSX clicked (dummy)");
  };

  const handleAddMarkList = () => {
    alert("Marks submitted (dummy)");
    console.log(students);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Grades</h2>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              Class {cls}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={selectedDiv}
          onChange={(e) => setSelectedDiv(e.target.value)}
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button
          onClick={handleFetchStudents}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load Students
        </button>
      </div>

      {/* Action Buttons */}
      {students.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleUploadXLSX}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Upload size={18} />
            Upload XLSX
          </button>
          <button
            onClick={handleAddMarkList}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <ClipboardList size={18} />
            Add Mark List
          </button>
        </div>
      )}

      {/* Student Table */}
      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-customDarkFg border dark:border-gray-600 rounded-lg table-fixed">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-800">
                <th className="p-3 w-3/4">Name</th>
                <th className="p-3 w-1/4">Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">{student.fullName}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={student.marks}
                      onChange={(e) =>
                        handleMarksChange(student._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-24 text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No students loaded.</p>
      )}
    </div>
  );
}

export default AddGrades;
