import React from 'react';
import LeftSidebar from './components/Home/Sidebar/LeftSideBar';
import RightSidebar from './components/Home/Sidebar/RightSidebar';
import HomeContent from './components/Home/HomeContent';


const Layout = () => {
  return (
    <div className="flex w-screen min-h-screen bg-transparent">
      <div className="w-[18%] border-r border-gray-200 dark:border-gray-700">
        <LeftSidebar />
      </div>
      <div className="w-[58%] p-4 overflow-y-auto">
        <HomeContent />
      </div>
      <div className="w-[24%] border-l border-gray-200 dark:border-gray-700 p-4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
