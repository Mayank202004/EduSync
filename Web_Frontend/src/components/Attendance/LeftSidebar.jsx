import React from 'react'
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Calendar from 'react-calendar';
import { exportAttendance } from '@/services/attendenceService';

function LeftSidebar({ onDateClicked = () => {}, markAttendance = ()=>{}, isClassTeacher, className, div,classesDivisions=[]}) {
  const [selectedClass, setSelectedClass] = useState(className);
  const [selectedDiv, setSelectedDiv] = useState(div);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  // Is user viewing their own class
  const isViewingOwnClass = isClassTeacher &&
    selectedClass === className &&
    selectedDiv === div;

  const currentClass = classesDivisions.find(
    (cls) => cls.className === selectedClass
  );

  return (
      <div className="w-full p-4 bg-white dark:bg-customDarkFg rounded h-full">
        <div>
          <h2 className="text-xl font-semibold mb-2">Class Selection</h2>
          {isClassTeacher && (
            <p className="text-sm text-green-600 mb-2">
              My Class: {className}-{div} <span className="text-xs">(Dashboard view available)</span>
            </p>
          )}
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedDiv(""); 
            }}
            className="w-full border p-2 rounded dark:bg-customDarkFg dark:text-white dark:border-gray-600"
          >
            <option value="">-- Select --</option>
            {classesDivisions.map((cls) => (
              <option key={cls._id} value={cls.className}>
                Class {cls.className}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-white mt-4 mb-1">Division</label>
          <select
            value={selectedDiv}
            onChange={(e) => setSelectedDiv(e.target.value)}
            disabled={!currentClass}
            className="w-full border p-2 rounded dark:bg-customDarkFg dark:text-white dark:border-gray-600"
          >
            <option value="">-- Select --</option>
            {currentClass?.divisions?.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
          <button
            onClick={() => {markAttendance(selectedClass,selectedDiv)}}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full mt-4"
          >Add Todays Attendance
          </button>
          {isClassTeacher && (
            <button
                onClick={() => {
                  exportAttendance(className,div)}
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full mt-4"
              >Export Attendance
          </button>)}
        </div>

        {isClassTeacher && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Attendance by Date</h2>
          <div className="flex justify-center items-center">
            <Calendar
              onChange={(date) => onDateClicked(date)}
              value={new Date()}
              className="rounded border"
            />
          </div>
        </div>
      )}
      </div>
  )
}

export default LeftSidebar