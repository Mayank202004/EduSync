import React, { useState } from "react";
import { Pencil, X, Save } from "lucide-react";

function MarkList({ context, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [marks, setMarks] = useState(context.studentMarks || []);
  const [totalMarks, setTotalMarks] = useState(
    marks.length > 0 ? marks[0].totalMarks : 0
  );

  const handleChange = (index, value) => {
    const updated = [...marks];
    updated[index].marksObtained = value;
    setMarks(updated);
  };

  const handleSave = () => {
    if (window.confirm("Are you sure you want to save the changes?")) {
      // Update totalMarks for all students
      const updatedMarks = marks.map((s) => ({ ...s, totalMarks }));
      console.log("Updated Marks:", updatedMarks);
      setMarks(updatedMarks);
      setIsEditing(false);
      // Call API here if needed
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {context.exam} - {context.subject}
          </h2>
          <p className="text-gray-600">
            Class {context.class}, Div {context.div}
          </p>
        </div>

        <div className="flex gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <Save size={16} /> Save
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? <X size={16} /> : <Pencil size={16} />}
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Total Marks Display/Input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Total Marks
        </label>
        {isEditing ? (
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            className="w-32 px-2 py-1 border rounded-md dark:bg-gray-800"
          />
        ) : (
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            {totalMarks}
          </span>
        )}
      </div>

      {/* Marks List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Student ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((student, index) => (
              <tr
                key={student.studentId}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 font-mono">{student.studentId}</td>
                <td className="px-4 py-2">{student.name || "N/A"}</td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      type="number"
                      value={student.marksObtained}
                      onChange={(e) =>
                        handleChange(index, Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 border rounded-md dark:bg-gray-800"
                    />
                  ) : (
                    student.marksObtained
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MarkList;
