import React from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import HomeContent from '@/components/Home/StudentComponents/HomeContent';
import { useState, useEffect} from 'react';
import { fetchStudentDashboardData } from '@/services/dashboardService';
import { formatEvents } from '@/utils/calendarUtil';


const StudentDashboard = () => {
  const [chats, setChats] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [attendanceOverMonths, setAttendanceOverMonths] = useState(null);
  const [events,setEvents] = useState([]);

  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchStudentDashboardData();
      setChats(response?.data.chatData);
      setAttendanceOverMonths(response?.data?.monthlyAttendancePercentage);
      setMonthlyAttendance(response?.data?.attendanceForTheMonth);
      setEvents(formatEvents(response?.data.events));
    };
    getDashboardData();
  }, []);

  return (
    <div className="flex grow w-full min-h-full bg-transparent">
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10 hidden md:block">
        <LeftSidebar chatData={chats}/>
      </div>
      <div className="w-full md:w-[70%] lg:w-[60%] p-4 overflow-y-auto">
        <HomeContent monthlyAttendance={monthlyAttendance} attendanceOverMonths={attendanceOverMonths}/>
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700 hidden pb-10 md:block">
        <RightSidebar events={events}/>
      </div>
    </div>
  );
};

export default StudentDashboard