import React, { useState } from "react";
import { Upload, ClipboardList, FileUp } from "lucide-react";
import { getStudentList } from "@/services/attendenceService";
import toast from "react-hot-toast";
import { addClassMarks } from "@/services/marksServices";

function AddGrades() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalMarks, setTotalMarks] = useState(""); 
  const [selectedExam, setSelectedExam] = useState("");


  const subjects = ["Math", "Science", "English"];
  const classes = ["1", "2", "3"];
  const divisions = ["A", "B", "C"];
  const exams = ["Unit Test 1", "Midterm", "Final Exam"];


  const handleFetchStudents = async () => {
    try {
      if (selectedClass && selectedDiv) {
        setIsLoading(true);
        const response = await getStudentList(selectedClass, selectedDiv);
        setStudents(response.data || []);
      }
    } catch (err) {
      // Error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarksChange = (id, value) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, marks: value } : s))
    );
  };

  const handleUploadXLSX = () => {
    alert("Upload XLSX clicked (dummy)");
  };

  const handleUploadMarklist = () => {
    alert("Upload Marklist clicked (dummy)");
  };

  const handleAddMarkList = async () => {
    if (!totalMarks || !selectedClass || !selectedDiv || !selectedSubject || !selectedExam) {
      toast.error("Please fill in all the required fields.");
    }
      try {
        await toast.promise(
          addClassMarks(selectedExam,selectedSubject,selectedClass,selectedDiv,students,totalMarks),
          {
            loading: "Adding Class Marks...",
            success: "Marks Added Successfully",
            error: "",
          }
        );
      } catch (err) {
        // Handled by axios instance
      }
}

  // Check if all students have marks filled
  const allMarksFilled =
    students.length > 0 &&
    students.every((s) => s.marks !== "" && s.marks !== null);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Grades</h2>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>
        
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
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={handleUploadXLSX}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Upload size={18} />
              Upload XLSX
            </button>

            <button
              onClick={handleUploadMarklist}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              <FileUp size={18} />
              Upload Marklist
            </button>
          </div>

          {/* Total Marks + Submit beside each other */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Total Marks</label>
              <input
                type="number"
                min="1"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="border rounded px-3 py-2 w-40"
                placeholder="Enter total marks"
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleAddMarkList}
                disabled={!allMarksFilled || !totalMarks}
                className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                  allMarksFilled && totalMarks
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <ClipboardList size={18} />
                Submit Marks
              </button>
            </div>
          </div>
        </>
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
                      max={totalMarks || 100}
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
