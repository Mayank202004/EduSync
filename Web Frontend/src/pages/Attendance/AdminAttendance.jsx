import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AttendanceDashboard from '@/components/Attendance/Dashboard';
import DaysSummary from '@/components/Attendance/DaysSummary';
import { useEffect } from 'react';
import { getAttendanceDashboardData, getTopLevelDashboardData } from '@/services/attendenceService';
import TopLevelDashboard from '@/components/Attendance/AdminComponents/TopLevelDashboard';
import ClassDashboard from '@/components/Attendance/AdminComponents/ClassDashboard';

function AdminAttendance() {

  // States
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDiv, setSelectedDiv] = useState('A');
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getTopLevelDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        // handled by axios interceptor
      }
    };
    fetchDashboardData();
  }, []);



  return (
    <div className="flex w-full min-h-screen bg-transparent">
      <div className="w-full py-4 pl-2 pr-4 overflow-y-auto">
        {/* Main Content */}
        <div className="flex-1 space-y-6 h-full">
          <div className="bg-white dark:bg-customDarkFg p-4 rounded shadow gap-4 h-full">
              {selectedClass ? (
                <ClassDashboard
                  onBack={() => setSelectedClass(null)} 
                  selectedClass={selectedClass}
                />
              ) : (
                <TopLevelDashboard
                  dashboardData={dashboardData}
                  // setDashboardData={setDashboardData}
                  onClassClicked={(cls)=>{setSelectedClass(cls)}}
                />
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;