import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AttendanceDashboard from '@/components/Attendance/Dashboard';
import LeftSidebar from '@/components/Attendance/LeftSidebar';
import DaysSummary from '@/components/Attendance/DaysSummary';
import { useEffect } from 'react';
import { getAttendanceDashboardData } from '@/services/attendenceService';
import MarkAttendance from '@/components/Attendance/MarkAttendance';
import { useAuth } from '@/auth/AuthContext';

function TeacherAttendance() {
  const { roleInfo } = useAuth();
  const isClassTeacher = !!roleInfo?.classTeacher;
const OwnClass = roleInfo?.classTeacher?.class ?? '1';
const OwnDiv = roleInfo?.classTeacher?.div ?? 'A';


  // States
  const [selectedClass, setSelectedClass] = useState(OwnClass ?? '1');
  const [selectedDiv, setSelectedDiv] = useState(OwnDiv ?? 'A');
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  useEffect(() => {
    if (!isClassTeacher) {
      return;
    }
    const fetchDashboardData = async () => {
      try {
        const response = await getAttendanceDashboardData(OwnClass,OwnDiv);
        setDashboardData(response.data);
      } catch (error) {
        // handled by axios interceptor
      }
    };
    fetchDashboardData();
  }, [isClassTeacher,OwnClass,OwnDiv]);

  const handleMarkAttendance = (className, div) => {
    setSelectedClass(className);
    setSelectedDiv(div);
    setIsMarkingAttendance(true);
  };



  return (
    <div className="flex w-full min-h-screen bg-transparent">
      <div className="w-[20%] dark:border-gray-700 pl-4 pr-1 py-4 h-full overflow-y-auto">
        <LeftSidebar
          isClassTeacher={isClassTeacher}
          className={OwnClass}
          div={OwnDiv}
          onDateClicked={(date)=> {
            setIsMarkingAttendance(false);
            setSelectedDate(date);
          }}
          markAttendance={(className,div) => handleMarkAttendance(className,div)}
        />
      </div>
      <div className="w-[80%] py-4 pl-2 pr-4 overflow-y-auto">
        {/* Main Content */}
        <div className="flex-1 space-y-6 h-full">
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
          ) : 
            <div className="bg-white dark:bg-customDarkFg p-4 rounded shadow gap-4 h-full">
              {selectedDate && isClassTeacher ? (
                <DaysSummary
                  goBack={() => setSelectedDate(null)} 
                  date={selectedDate}
                  isClassTeacher={isClassTeacher}
                  className={OwnClass}
                  div={OwnDiv}
                />
              ) : (
                <AttendanceDashboard
                  dashboardData={dashboardData}
                  setDashboardData={setDashboardData}
                  isClassTeacher={isClassTeacher}
                  className={OwnClass}
                  div={OwnDiv}
                />
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;