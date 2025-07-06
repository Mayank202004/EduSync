import React, { useState } from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import AdminHomeContent from '@/components/Home/AdminComponents/AdminHomeContent';
import VerifyStudents from '@/components/Home/AdminComponents/Verifystudents';


const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('home');

  const onBackPressed = () => setActiveView('home');

  const renderMainContent = () => {
    switch (activeView) {
      case 'verify-students':
        return <VerifyStudents onBackPressed={onBackPressed} />;
      case 'home':
      default:
        return <AdminHomeContent setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex grow w-full min-h-full bg-transparent">
      <div className="w-[20%] border-r border-gray-200 dark:border-gray-700">
        <LeftSidebar />
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
