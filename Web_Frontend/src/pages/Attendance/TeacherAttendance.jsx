import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AttendanceDashboard from '@/components/Attendance/Dashboard';
import LeftSidebar from '@/components/Attendance/LeftSidebar';
import DaysSummary from '@/components/Attendance/DaysSummary';
import { useEffect } from 'react';
import { getAllClasses, getAttendanceDashboardData } from '@/services/attendenceService';
import MarkAttendance from '@/components/Attendance/MarkAttendance';
import { useAuth } from '@/context/AuthContext';

function TeacherAttendance() {
  const { roleInfo } = useAuth();
  const isClassTeacher = !!roleInfo?.classTeacher;
  const OwnClass = roleInfo?.classTeacher?.class;
  const OwnDiv = roleInfo?.classTeacher?.div;


  // States
  const [selectedClass, setSelectedClass] = useState(OwnClass);
  const [selectedDiv, setSelectedDiv] = useState(OwnDiv);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [classesDivisions, setClassesDivisions] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isClassTeacher) {
          const response = await getAllClasses();
          setClassesDivisions(response.data);
        } else {
          const response = await getAttendanceDashboardData(OwnClass, OwnDiv);
          setDashboardData(response.data);
          setClassesDivisions(response.data?.classesDivisions);
        }
      } catch (error) {
        // handled by axios interceptor
      }
    };
    fetchData();
  }, [isClassTeacher, OwnClass, OwnDiv]);


  const handleMarkAttendance = (className, div) => {
    setSelectedClass(className);
    setSelectedDiv(div);
    setIsMarkingAttendance(true);
  };



return (
  <div className="flex flex-col md:flex-row w-full min-h-screen bg-transparent">
    {/* Sidebar */}
    <div className="w-full md:w-[35%] lg:w-[30%] xl:w-[20%] dark:border-gray-700 pt-4 px-4 md:pl-4 md:pr-1 lg:pr-2 md:pb-4 h-auto md:h-full overflow-y-auto">
      <LeftSidebar
        isClassTeacher={isClassTeacher}
        className={OwnClass}
        div={OwnDiv}
        classesDivisions={classesDivisions ?? []}
        onDateClicked={(date) => {
          setIsMarkingAttendance(false);
          setSelectedDate(date);
        }}
        markAttendance={(className, div) => handleMarkAttendance(className, div)}
      />
    </div>

    {/* Main Content */}
    <div className="w-full md:w-[65%] lg:w-[70%] xl:w-[80%] py-4 md:pl-2 md:pr-4 px-4 overflow-y-auto">
      <div className="flex-1 space-y-6 h-full">
        {isMarkingAttendance ? (
          <MarkAttendance
            goBack={() => {
              setIsMarkingAttendance(false);
              setSelectedDate(null);
            }}
            className={selectedClass}
            div={selectedDiv}
          />
        ) : (
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
                isClassTeacher={isClassTeacher}
                className={OwnClass}
                div={OwnDiv}
              />
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default TeacherAttendance;