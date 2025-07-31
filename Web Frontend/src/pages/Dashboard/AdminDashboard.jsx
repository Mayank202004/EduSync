import React, { useState, useEffect} from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import AdminHomeContent from '@/components/Home/AdminComponents/AdminHomeContent';
import VerifyStudents from '@/components/Home/AdminComponents/Verifystudents';
import VerifyTeachers from '@/components/Home/AdminComponents/VerifyTeachers';
import ManageClasses from '@/components/Home/AdminComponents/ManageClasses';
import ManageTeacherSubjects from '@/components/Home/AdminComponents/ManageSubjects';
import ManageAcademicYear from '@/components/Home/AdminComponents/ManageAcademicYear/ManageAcademicYear';
import { fetchSuperAdminDashboardData } from '@/services/dashboardService';
import TicketInbox from '@/components/Home/AdminComponents/TicketInbox';
import { formatEvents } from '@/utils/calendarUtil';



const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('home');
  const [chats, setChats] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [events,setEvents] = useState([]);
  
  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchSuperAdminDashboardData();
      setChats(response?.data.chatData);
      setAllUsers(response?.data.allUsers);
      setEvents(formatEvents(response?.data.events));
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
      case 'manage-subjects':
        return <ManageTeacherSubjects onBackPressed={onBackPressed} />;
      case 'manage-academic-year':
        return <ManageAcademicYear onBackPressed={onBackPressed} />;
      case 'ticket-inbox':
        return <TicketInbox onBackPressed={onBackPressed}/>
      case 'home':
      default:
        return <AdminHomeContent setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex grow w-full h-screen bg-transparent">
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10 hidden md:block">
        <LeftSidebar chatData={chats} setChatData={setChats} searchUsers={allUsers}/>
      </div>
      <div className="w-full md:w-[70%] lg:w-[60%] p-4 overflow-y-auto">
        {renderMainContent()}
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700 hidden pb-10 md:block">
        <RightSidebar events={events}/>
      </div>
    </div>
  );
};

export default AdminDashboard;
