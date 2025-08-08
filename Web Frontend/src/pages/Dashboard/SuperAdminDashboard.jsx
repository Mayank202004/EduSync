import React, { useState, useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatsPanel } from "@/hooks/useChatsPanel";
import LeftSidebar from "@/components/Home/Sidebar/LeftSidebar";
import RightSidebar from "@/components/Home/Sidebar/RightSidebar";
import AdminHomeContent from "@/components/Home/AdminComponents/AdminHomeContent";
import VerifyStudents from "@/components/Home/AdminComponents/Verifystudents";
import VerifyTeachers from "@/components/Home/AdminComponents/VerifyTeachers";
import ManageClasses from "@/components/Home/AdminComponents/ManageClasses";
import ManageTeacherSubjects from "@/components/Home/AdminComponents/ManageSubjects";
import ManageAcademicYear from "@/components/Home/AdminComponents/ManageAcademicYear/ManageAcademicYear";
import { fetchSuperAdminDashboardData } from "@/services/dashboardService";
import TicketInbox from "@/components/Home/AdminComponents/TicketInbox";
import ShowChatsButton from "@/components/Home/ShowChatsButton";
import IconTextButton from "@/components/Chat/IconTextButton";
import { formatEvents } from "@/utils/calendarUtil";

const SuperAdminDashboard = () => {
  const [activeView, setActiveView] = useState('home');
  const [chats, setChats] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [events, setEvents] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { showChatButton } = useChatsPanel();

  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchSuperAdminDashboardData();
      setChats(response?.data.chatData);
      setAllUsers(response?.data.allUsers);
      setEvents(formatEvents(response?.data.events));
    };
    getDashboardData();
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = ""; // Restore scroll
    }
  }, [isChatOpen]);

  const onBackPressed = () => setActiveView("home");

  const renderMainContent = () => {
    switch (activeView) {
      case "verify-students":
        return <VerifyStudents onBackPressed={onBackPressed} />;
      case "verify-teachers":
        return <VerifyTeachers onBackPressed={onBackPressed} />;
      case "manage-classes":
        return <ManageClasses onBackPressed={onBackPressed} />;
      case "manage-subjects":
        return <ManageTeacherSubjects onBackPressed={onBackPressed} />;
      case "manage-academic-year":
        return <ManageAcademicYear onBackPressed={onBackPressed} />;
      case "ticket-inbox":
        return <TicketInbox onBackPressed={onBackPressed} />;
      case "home":
      default:
        return <AdminHomeContent setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="relative flex grow w-full h-screen bg-transparent">
      {/* Left Sidebar - Desktop only */}
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10 hidden md:block">
        <LeftSidebar
          chatData={chats}
          setChatData={setChats}
          searchUsers={allUsers}
        />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[70%] lg:w-[60%] p-4 overflow-y-auto">
        {renderMainContent()}
      </div>

      {/* Right Sidebar - Desktop only */}
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700 hidden pb-10 md:block">
        <RightSidebar events={events} />
      </div>

      {/* Floating Chat Button - Mobile only */}
      {!isChatOpen && (
        <ShowChatsButton
          isShown={showChatButton}
          onClick={() => setIsChatOpen(true)}
        />
      )}

      {/* Mobile Chat Drawer/Modal */}
      {isChatOpen && (
        <div className="fixed tablet:hidden inset-0 top-15 z-20 bg-transparent w-full h-full">
          <div className="w-full h-full relative overflow-y-auto">
            <IconTextButton
              buttonProps={{ onClick: () => setIsChatOpen(false) }}
              className="absolute top-5 right-3 size-8 p-0 rounded-full"
              icon={<FontAwesomeIcon icon={faXmark} className="text-lg" />}
            />
            <div className="h-full bg-transparent rounded-md shadow-md">
              <LeftSidebar
                chatData={chats}
                setChatData={setChats}
                searchUsers={allUsers}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
