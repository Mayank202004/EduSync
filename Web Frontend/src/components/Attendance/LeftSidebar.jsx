import React from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';

const myClass = '1';
const myDiv = 'A';
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

function LeftSidebar() {

  const [isClassTeacher] = useState(true);
  const [selectedClass, setSelectedClass] = useState(myClass);
  const [selectedDiv, setSelectedDiv] = useState(myDiv);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());  
  const isViewingOwnClass = isClassTeacher && selectedClass === myClass && selectedDiv === myDiv;  
  const dateKey = selectedDate.toISOString().split('T')[0];
  const attendanceForDate = dummyAttendanceByDate[dateKey];

  return (
      <div className="w-full p-4 bg-white dark:bg-customDarkFg rounded h-full">
        <div>
          <h2 className="text-xl font-semibold mb-2">Class Selection</h2>
          {isClassTeacher && (
            <p className="text-sm text-green-600 mb-2">
              My Class: {myClass}-{myDiv} <span className="text-xs">(Dashboard view available)</span>
            </p>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select --</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Division</label>
          <select
            value={selectedDiv}
            onChange={(e) => setSelectedDiv(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select --</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Attendance by Date</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded border"
          />
        </div>
      </div>
  )
}

export default LeftSidebar