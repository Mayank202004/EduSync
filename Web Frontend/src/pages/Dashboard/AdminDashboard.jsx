import React, { useState, useEffect} from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import AdminHomeContent from '@/components/Home/AdminComponents/AdminHomeContent';
import VerifyStudents from '@/components/Home/AdminComponents/Verifystudents';
import VerifyTeachers from '@/components/Home/AdminComponents/VerifyTeachers';
import ManageClasses from '@/components/Home/AdminComponents/ManageClasses';
import { fetchSuperAdminDashboardData } from '@/services/dashboardService';


const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('home');
  const [chats, setChats] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  
  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchSuperAdminDashboardData();
      setChats(response?.data.chatData);
      setAllUsers(response?.data.allUsers);
    };
    getDashboardData();
  }, []);

  const onBackPressed = () => setActiveView('home');

  const renderMainContent = () => {
    switch (activeView) {
      case 'verify-students':
        return <VerifyStudents onBackPressed={onBackPressed} />;
      case 'verify-teachers':
        return <VerifyTeachers onBackPressed={onBackPressed} />;
      case 'manage-classes':
        return <ManageClasses onBackPressed={onBackPressed} />;
      case 'home':
      default:
        return <AdminHomeContent setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex grow w-full h-screen bg-transparent">
      <div className="w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10">
        <LeftSidebar chatData={chats} setChatData={setChats} searchUsers={allUsers}/>
      </div>
      <div className="w-[60%] p-4 overflow-y-auto">
        {renderMainContent()}
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700">
        <RightSidebar />
      </div>
    </div>
  );
};

export default AdminDashboard;
