import React from 'react';
import { ArrowLeft } from 'lucide-react';

function DaysSummary({goBack = ()=>{}}) {
  const students = [
    { name: 'Alice Johnson', status: 'Present' },
    { name: 'Bob Smith', status: 'Absent' },
    { name: 'Charlie Doe', status: 'Permitted Leave' },
    { name: 'Daisy Carter', status: 'Present' },
  ];
  const totalIcon = 'src/assets/attendance/students.png';
  const presentIcon = 'src/assets/attendance/present.png';
  const absentIcon = 'src/assets/attendance/absent.png';
  const leaveIcon = 'src/assets/attendance/permit.png';


  return (
    <div className="p-6 bg-white dark:bg-customDarkFg text-gray-900 dark:text-white min-h-screen">
      <button
          onClick={goBack}
          className='mb-4 flex items-center text-blue-600 hover:underline'
          >
          <ArrowLeft className='mr-2' size={18} />
          Back to dashboard
        </button>
      <h1 className="text-2xl font-semibold mb-4">Day's Attendance Summary</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 rounded-2xl p-4 shadow flex items-center gap-4">
          <img src={totalIcon} alt="Total Students" className="w-10 h-10" />
          <div>
            <h2 className="text-sm font-medium">Total Students</h2>
            <p className="text-2xl font-bold">40</p>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900 rounded-2xl p-4 shadow flex items-center gap-4">
          <img src={presentIcon} alt="Present Students" className="w-10 h-10" />
          <div>
            <h2 className="text-sm font-medium">Present</h2>
            <p className="text-2xl font-bold">32</p>
          </div>
        </div>

        <div className="bg-red-100 dark:bg-red-900 rounded-2xl p-4 shadow flex items-center gap-4">
          <img src={absentIcon} alt="Absent Students" className="w-10 h-10" />
          <div>
            <h2 className="text-sm font-medium">Absent</h2>
            <p className="text-2xl font-bold">6</p>
          </div>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-2xl p-4 shadow flex items-center gap-4">
          <img src={leaveIcon} alt="Permitted Leave" className="w-10 h-10" />
          <div>
            <h2 className="text-sm font-medium">Permitted Leave</h2>
            <p className="text-2xl font-bold">2</p>
          </div>
        </div>
      </div>


      {/* Students List */}
      <div className="bg-gray-50 dark:bg-customDarkFg border dark:border-gray-500 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Students</h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student, index) => (
            <li key={index} className="flex justify-between py-2">
              <span>{student.name}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  student.status === 'Present'
                    ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white'
                    : student.status === 'Absent'
                    ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-white'
                    : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-white'
                }`}
              >
                {student.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DaysSummary;
