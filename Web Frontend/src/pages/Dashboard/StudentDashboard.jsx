import React from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import HomeContent from '@/components/Home/HomeContent';
import { useState, useEffect} from 'react';
import { fetchStudentDashboardData } from '@/services/dashboardService';


const StudentDashboard = () => {
  const [chats, setChats] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchStudentDashboardData();
      setChats(response?.data.chatData);
    };
    getDashboardData();
  }, []);

  return (
    <div className="flex grow w-full min-h-full bg-transparent">
      <div className="w-[20%] border-r border-gray-200 dark:border-gray-700">
        <LeftSidebar chatData={chats}/>
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

export default StudentDashboard