import React, { useEffect, useState } from 'react';
import { getStudentList, markAttendance } from '@/services/attendenceService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

function MarkAttendance({ className, div, goBack = () => {} }) {
  const [students, setStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [plStudents, setPlStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentList(className, div);
        setStudents(response.data);
      } catch (error) {
        // Error handled by axios interceptor
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentList();
  }, [className, div]);

  const toggleAbsent = (id) => {
    setAbsentStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setPlStudents((prev) => prev.filter((x) => x !== id));
  };

  const togglePL = (id) => {
    setPlStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setAbsentStudents((prev) => prev.filter((x) => x !== id));
  };

  const handleSubmit = async () => {
    try {
      await toast.promise(
        markAttendance(absentStudents, plStudents, date),
        {
          loading: "Marking Attendance...",
          success: "Attendance marked successfully",
          error: "",
        }
      );
    } catch (err) {
      // Handled by axios instance
    }
  };


  // Skeleton loading view for table
  const renderSkeletonRow = (index) => (
  <tr key={index} className="border-t dark:border-gray-600 animate-pulse">
    <td className="p-3 w-4/6">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-[50%]"></div>
    </td>
    <td className="p-3 w-1/6">
      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-sm mx-auto"></div>
    </td>
    <td className="p-3 w-1/6">
      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-sm mx-auto"></div>
    </td>
  </tr>
);


  return (
    <div className="bg-white dark:bg-customDarkFg p-6 rounded-lg shadow min-h-screen">
      <button
        onClick={goBack}
        className="mb-4 flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Dashboard
      </button>
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-customDarkFg border dark:border-gray-600 rounded-lg table-fixed">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-gray-800">
              <th className="p-3 w-4/6">Name</th>
              <th className="p-3 w-1/6">Absent</th>
              <th className="p-3 w-1/6">Permitted Leave</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length:10 }).map((_, i) => renderSkeletonRow(i))
              : students.length > 0
              ? students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3">{student.fullName}</td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={absentStudents.includes(student._id)}
                        onChange={() => toggleAbsent(student._id)}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={plStudents.includes(student._id)}
                        onChange={() => togglePL(student._id)}
                      />
                    </td>
                  </tr>
                ))
              : !isLoading && (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {students.length > 0 && !isLoading && (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
}

export default MarkAttendance;
