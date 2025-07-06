import React, { useEffect, useState } from "react";
import { fetchUnverifiedStudents } from "@/services/dashboardService";
import VerifyStudentModal from "./VerifyStudentModal";
import { verifyStudent } from "@/services/dashboardService";

const VerifyStudents = ({ onBackPressed }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await fetchUnverifiedStudents();
      setStudents(response.data);
    } catch (err) {
      // Already handled by axios Interceptor
    } finally {
      setLoading(false)
    }
  };

  fetchStudents();
}, []);


  const cleanedStudents = students.filter((s) => s.class && s.userId);

  const grouped = cleanedStudents.reduce((acc, student) => {
    const classValue = student.class;
    if (!acc[classValue]) acc[classValue] = [];
    acc[classValue].push(student);
    return acc;
  }, {});


  const allClasses = Object.keys(grouped).sort();

  const filteredStudents = students.filter((s) =>
    `${s.userId?.fullName} ${s.userId?.email} ${s.class}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Verify Students</h2>
        <button
          onClick={onBackPressed}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Dropdown */}
      <div className="mb-6 relative w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-customDarkFg text-gray-800 dark:text-white"
          placeholder="Search students..."
        />
        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-customDarkFg border border-gray-300 dark:border-gray-700 rounded shadow-md">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default"
                >
                  <strong>{s.userId?.fullName ?? "Undefined name"}</strong> – Class {s.class}
                  <br />
                  <span className="text-xs">{s.userId?.email ?? "No email"}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No matching students
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skeleton while loading */}
      {loading ? (
        <SkeletonVerifyCard />
      ) : students.length === 0 ? (
        <div className="w-full text-center mt-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            All students are already verified!
          </p>
        </div>
      ) : (
        allClasses.map((cls) => (
          <div key={cls} className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">
              Class {cls}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {grouped[cls].map((student) => (
                <div
                  key={student._id}
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowModal(true);
                  }}
                  className="cursor-pointer p-4 rounded-xl bg-white dark:bg-customDarkFg border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {student.userId?.fullName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {student.userId?.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      
      {/* Verify Student Modal */}
      {showModal && selectedStudent && (
        <VerifyStudentModal
          student={selectedStudent}
          onClose={() => setShowModal(false)}
          onVerify={(studId, className, div) => verifyStudent(studId, className, div)}
          onSubmit={() => {
            setStudents(students.filter((s) => s._id !== selectedStudent._id));
            setSelectedStudent(null);
            setShowModal(false)
          }}
        />
      )}
    </div>
  );
};

// Skeleton Loading for verify students UI
const SkeletonVerifyCard = () => {
  const skeletons = Array.from({ length: 2 }, (_, idx) => (
    <div key={idx} className="mb-8 animate-pulse">
      <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow"
          >
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  ));

  return <>{skeletons}</>;
};


export default VerifyStudents;
