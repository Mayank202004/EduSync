import React from 'react'

const TeacherDashboard = () => {
  return (
    <div className="flex grow w-full min-h-full bg-transparent">
      <div className="w-[20%] border-r border-gray-200 dark:border-gray-700">
        <LeftSidebar />
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