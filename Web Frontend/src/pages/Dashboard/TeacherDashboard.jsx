import React from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import HomeContent from '@/components/Home/HomeContent';
import { fetchTeacherDashboardData } from '@/services/dashboardService';
import { useState, useEffect } from 'react';

const TeacherDashboard = () => {
  const [chats, setChats] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchTeacherDashboardData();
      setChats(response?.data.chatData);
    };
    getDashboardData();
  }, []);
  return (
    <div className="flex grow w-full h-screen  bg-transparent">
      <div className="w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10">
        <LeftSidebar chatData={chats} setChatData={setChats}/>
      </div>
      <div className="w-[60%] p-4 overflow-y-auto">
        <HomeContent />
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700">
        <RightSidebar />
      </div>
    </div>
  );
};

export default TeacherDashboard