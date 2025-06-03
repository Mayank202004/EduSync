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
import TopLevelDashboard from '@/components/Attendance/AdminComponents/TopLevelDashboard';

function AdminAttendance() {

  // States
  const [selectedClass, setSelectedClass] = useState('1');
  const [selectedDiv, setSelectedDiv] = useState('A');
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAttendanceDashboardData(OwnClass,OwnDiv);
        setDashboardData(response.data);
      } catch (error) {
        // handled by axios interceptor
      }
    };
    fetchDashboardData();
  }, [selectedClass,selectedDiv]);



  return (
    <div className="flex w-full min-h-screen bg-transparent">
      <div className="w-full py-4 pl-2 pr-4 overflow-y-auto">
        {/* Main Content */}
        <div className="flex-1 space-y-6 h-full">
          <div className="bg-white dark:bg-customDarkFg p-4 rounded shadow gap-4 h-full">
              {selectedDate ? (
                <DaysSummary
                  goBack={() => setSelectedDate(null)} 
                  date={selectedDate}
                  className={selectedClass}
                  div={selectedDiv}
                />
              ) : (
                <TopLevelDashboard
                  dashboardData={dashboardData}
                  setDashboardData={setDashboardData}
                  className={selectedClass}
                  div={selectedDiv}
                />
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;