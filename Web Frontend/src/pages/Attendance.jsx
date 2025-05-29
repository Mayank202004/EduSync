import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AttendanceDashboard from '@/components/Attendance/Dashboard';
import LeftSidebar from '@/components/Attendance/LeftSidebar';
import DaysSummary from '@/components/Attendance/DaysSummary';
import { useEffect } from 'react';
import { getAttendanceDashboardData } from '@/services/attendenceService';
import MarkAttendance from '@/components/Attendance/MarkAttendance';

const myClass = '1';
const myDiv = 'A';

function Attendance() {
  const [isClassTeacher] = useState(true);
  const [selectedClass, setSelectedClass] = useState(myClass);
  const [selectedDiv, setSelectedDiv] = useState(myDiv);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  const isViewingOwnClass = isClassTeacher;

  useEffect(() => {
    if (!isClassTeacher) {
      return;
    }
    const fetchDashboardData = async () => {
      try {
        const response = await getAttendanceDashboardData('1', 'A'); // To do : currently static need to use teachers data
        setDashboardData(response.data);
      } catch (error) {
        // handled by axios interceptor
      }
    };
    fetchDashboardData();
  }, []);

  const handleMarkAttendance = (className, div) => {
    setSelectedClass(className);
    setSelectedDiv(div);
    setIsMarkingAttendance(true);
  };


  // const dateKey = selectedDate.toISOString().split('T')[0];
  // const attendanceForDate = dummyAttendanceByDate[dateKey];

  return (
    <div className="flex w-full h-full bg-transparent">
      <div className="w-[20%] dark:border-gray-700 pl-4 pr-1 py-4">
        <LeftSidebar 
          onDateClicked={(date)=> {
            setIsMarkingAttendance(false);
            setSelectedDate(date);
          }}
          markAttendance={(className,div) => handleMarkAttendance(className,div)}
        />
      </div>
      <div className="w-[80%] p-4 overflow-y-auto">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {isMarkingAttendance ? (
            <MarkAttendance
              goBack={()=> 
                {
                  setIsMarkingAttendance(false);
                  setSelectedDate(null);
                }}
              className={selectedClass}
              div={selectedDiv}
            />
          ) : isViewingOwnClass && (
            <div className="bg-white dark:bg-customDarkFg p-4 rounded shadow gap-4">
              {selectedDate ? (
                <DaysSummary
                  goBack={() => setSelectedDate(null)}
                  className="1"
                  div="A"
                  date={selectedDate}
                />
              ) : (
                <AttendanceDashboard
                  dashboardData={dashboardData}
                  setDashboardData={setDashboardData}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;