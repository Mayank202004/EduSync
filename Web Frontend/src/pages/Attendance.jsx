import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AttendanceDashboard from '@/components/Attendance/Dashboard';
import LeftSidebar from '@/components/Attendance/LeftSidebar';
import RightSidebar from '@/components/Attendance/RightSidebar';

const dummyStudents = [
  { name: 'Riya Sharma', gender: 'Female' },
  { name: 'Amit Verma', gender: 'Male' },
  { name: 'Sana Khan', gender: 'Female' },
  { name: 'Rahul Singh', gender: 'Male' }
];

const dummyStats = {
  total: 4,
  present: 3,
  absent: 1,
  boysPresent: 1,
  girlsPresent: 2
};

const dummyAttendanceByDate = {
  '2025-05-22': {
    present: ['Riya Sharma', 'Amit Verma', 'Sana Khan'],
    absent: ['Rahul Singh']
  },
  '2025-05-23': {
    present: ['Riya Sharma', 'Rahul Singh'],
    absent: ['Amit Verma', 'Sana Khan']
  }
};

const myClass = '1';
const myDiv = 'A';

function Attendance() {
  const [isClassTeacher] = useState(true);
  const [selectedClass, setSelectedClass] = useState(myClass);
  const [selectedDiv, setSelectedDiv] = useState(myDiv);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isViewingOwnClass = isClassTeacher && selectedClass === myClass && selectedDiv === myDiv;

  const dateKey = selectedDate.toISOString().split('T')[0];
  const attendanceForDate = dummyAttendanceByDate[dateKey];

  return (
    <div className="flex w-full min-h-screen bg-transparent">
      <div className="w-[20%] dark:border-gray-700 pl-4 pr-1 py-4">
        <LeftSidebar />
      </div>
      <div className="w-[80%] p-4 overflow-y-auto">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {isViewingOwnClass && (
            <div className="bg-white p-4 rounded shadow gap-4">
              <AttendanceDashboard/>
            </div>
          )}

          <button
            onClick={() => setShowAttendanceForm(!showAttendanceForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showAttendanceForm ? 'Hide' : 'Add'} Attendance
          </button>

          {showAttendanceForm && selectedClass && selectedDiv && (
            <div className="bg-white p-4 rounded shadow space-y-4">
              <h2 className="text-xl font-semibold">Mark Attendance - {selectedClass}-{selectedDiv}</h2>
              {dummyStudents.map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  <span>{student.name} ({student.gender})</span>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Submit Attendance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;