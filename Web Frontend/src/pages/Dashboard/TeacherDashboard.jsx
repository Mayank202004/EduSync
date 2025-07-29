import React from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import TeacherHomeContent from '@/components/Home/TeacherComponents/TeacherHomeContent';
import { fetchTeacherDashboardData } from '@/services/dashboardService';
import { useState, useEffect } from 'react';
import { formatEvents } from '@/utils/calendarUtil';

const TeacherDashboard = () => {
  const [chats, setChats] = useState(null);
  const [events,setEvents] = useState([]);

  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchTeacherDashboardData();
      setChats(response?.data.chatData);
      setEvents(formatEvents(response?.data.events));
    };
    getDashboardData();
  }, []);
  return (
    <div className="flex grow w-full h-screen  bg-transparent">
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10 hidden md:block">
        <LeftSidebar chatData={chats} setChatData={setChats}/>
      </div>
      <div className="w-full md:w-[70%] lg:w-[60%] p-4 overflow-y-auto">
        <TeacherHomeContent />
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700 hidden pb-10 md:block">
        <RightSidebar events={events}/>
      </div>
    </div>
  );
};

export default TeacherDashboard