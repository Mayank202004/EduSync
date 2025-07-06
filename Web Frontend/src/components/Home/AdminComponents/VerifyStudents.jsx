import React, { useState } from 'react';

// Sample dummy student data with classes
const dummyStudents = [
  { id: 1, name: 'Aarav Mehta', email: 'aarav.mehta@example.com', class: '1' },
  { id: 2, name: 'Diya Sharma', email: 'diya.sharma@example.com', class: '2' },
  { id: 3, name: 'Kabir Verma', email: 'kabir.verma@example.com', class: '1' },
  { id: 4, name: 'Sneha Patel', email: 'sneha.patel@example.com', class: '2' },
  { id: 5, name: 'Ishaan Roy', email: 'ishaan.roy@example.com', class: '3' },
];

const VerifyStudents = ({ onBackPressed }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const students = dummyStudents;

  // Group students by class
  const grouped = students.reduce((acc, student) => {
    if (!acc[student.class]) acc[student.class] = [];
    acc[student.class].push(student);
    return acc;
  }, {});

  const allClasses = Object.keys(grouped).sort();

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
            {students
              .filter((s) =>
                `${s.name} ${s.email} ${s.class}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default"
                >
                  <strong>{s.name}</strong> – Class {s.class} <br />
                  <span className="text-xs">{s.email}</span>
                </div>
              ))}
            {students.filter((s) =>
              `${s.name} ${s.email} ${s.class}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No matching students
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student List Grouped by Class */}
      {students.length === 0 ? (
        <div className="w-full text-center mt-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            ✅ All students are already verified!
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
                  key={student.id}
                  className="p-4 rounded-xl bg-white dark:bg-customDarkFg border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {student.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {student.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VerifyStudents;
