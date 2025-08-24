import React, { useState, useEffect} from 'react';
import LeftSidebar from '@/components/Home/Sidebar/LeftSidebar';
import RightSidebar from '@/components/Home/Sidebar/RightSidebar';
import AdminHomeContent from '@/components/Home/AdminComponents/AdminHomeContent';
import VerifyStudents from '@/components/Home/AdminComponents/VerifyStudents';
import VerifyTeachers from '@/components/Home/AdminComponents/VerifyTeachers';
import ManageClasses from '@/components/Home/AdminComponents/ManageClasses';
import ManageTeacherSubjects from '@/components/Home/AdminComponents/ManageSubjects';
import ManageAcademicYear from '@/components/Home/AdminComponents/ManageAcademicYear/ManageAcademicYear';
import { fetchSuperAdminDashboardData } from '@/services/dashboardService';
import TicketInbox from '@/components/Home/AdminComponents/TicketInbox';
import { formatEvents } from '@/utils/calendarUtil';
import AdminControlSidebar from '@/components/Home/SystemAdminComponents/AdminControlSidebar';
import AdminControlHome from '@/components/Home/SystemAdminComponents/AdminControlHome';



const AdminControl = () => {
  const [activeView, setActiveView] = useState('home');
  const [chats, setChats] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [events,setEvents] = useState([]);
  
  useEffect(() => {
    const getDashboardData = async () => {
    //   const response = await fetchSuperAdminDashboardData();
    //   setChats(response?.data.chatData);
    //   setAllUsers(response?.data.allUsers);
    //   setEvents(formatEvents(response?.data.events));
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
        return <AdminControlHome/>;
    }
  };

  return (
    <div className="flex grow w-full h-screen dark:bg-customDarkFg bg-customLightBg">
      <div className="md:w-[30%] lg:w-[20%] dark:border-gray-700 h-full py-5 pl-5 ">
        <AdminControlSidebar/>
      </div>
      <div className="w-full md:w-[70%] lg:w-[80%] py-5 pr-5 overflow-y-auto">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default AdminControl;
