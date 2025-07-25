import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { assignStudentDivisions } from "@/services/dashboardService";

const ManualDivisionAllotment = ({ onBack, classes, allStudents }) => {
  const [selectedClass, setSelectedClass] = useState("1");
  const [students, setStudents] = useState([]);
  const [divisionMap, setDivisionMap] = useState({});
  const [divisionOptions, setDivisionOptions] = useState([]);

  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setDivisionOptions([]);
      setDivisionMap({});
      return;
    }
  
    const filtered = allStudents.filter((stu) => stu.class === selectedClass);
    setStudents(filtered);
  
    const matchedClass = classes.find((cls) => cls.className === selectedClass);
    setDivisionOptions(matchedClass?.divisions || []);
  
    // Initialize division map based on existing student divisions
    const initialMap = {};
    filtered.forEach((stu) => {
      if (stu.div) initialMap[stu._id] = stu.div;
    });
    setDivisionMap(initialMap);
  }, [selectedClass, allStudents, classes]);
  

  const handleDivisionChange = (id, division) => {
    setDivisionMap((prev) => ({ ...prev, [id]: division }));
  };

  const handleSubmit = async () => {
    if (!selectedClass) return toast.error("Select a class first");

    const assignments = students.map((stu) => ({
      _id: stu._id,
      div: divisionMap[stu._id] || ""
    }));

    const hasUnassigned = assignments.some((a) => !a.div);
    if (hasUnassigned) return toast.error("All students must be assigned a division");

    try {
      await toast.promise(
        assignStudentDivisions(selectedClass,assignments), 
        {
          loading: "Assigning divisions...",
          success: "Divisions assigned successfully",
          error: "",
        }
      );
    } catch (err) {
      // Handled by axios interceptor
    }
  };



  return (
    <div className="bg-gray-50 dark:bg-customDarkFg border border-gray-200 dark:border-none p-6 rounded-xl shadow-sm">
       <button
         onClick={onBack}
         className="flex items-center gap-2 text-blue-600 hover:underline mb-2"
       >
         <ArrowLeft size={18} /> Back to Manage Academic Year
       </button>
      <h3 className="text-xl font-semibold mb-4">🧑‍🏫 Manual Division Allotment</h3>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium ">Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full text-black dark:text-white dark:bg-customDarkFg"
        >
          {classes.map((cls) => (
            <option key={cls.className} value={cls.className}>
              Class {cls.className}
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
                <td className="py-2 px-3">{stu.userId?.fullName || "N/A"}</td>
                <td className="py-2 px-3">
                  <select
                    value={divisionMap[stu._id] || ""}
                    onChange={(e) => handleDivisionChange(stu._id, e.target.value)}
                    className="border px-2 py-1 rounded text-black dark:text-white w-full dark:bg-customDarkFg"
                  >
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

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Submit Division Assignments
        </button>
      )}
    </div>
  );
};

export default ManualDivisionAllotment;
