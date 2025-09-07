import React from "react";
import { useState, useEffect } from "react";
import { useChatsPanel } from "@/hooks/useChatsPanel";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeftSidebar from "@/components/Home/Sidebar/LeftSidebar";
import RightSidebar from "@/components/Home/Sidebar/RightSidebar";
import IconTextButton from "@/components/Chat/IconTextButton";
import TeacherHomeContent from "@/components/Home/TeacherComponents/TeacherHomeContent";
import { fetchTeacherDashboardData } from "@/services/dashboardService";
import { formatEvents } from "@/utils/calendarUtil";
import ShowChatsButton from "@/components/Home/ShowChatsButton";
import { useSocket } from "@/context/SocketContext";

const TeacherDashboard = () => {
  const [chats, setChats] = useState(null);
  const [events, setEvents] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const { showChatButton } = useChatsPanel();
  const [loading, setLoading] = useState(true);
  const { unreadCounts, setUnreadCounts } = useSocket(); 
  
  // Sum all chat unread counts (Used for mobile screen floating chat button)
  const totalUnread = Object.values(unreadCounts || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  useEffect(() => {
    const getDashboardData = async () => {
      try{
        setLoading(true);
        const response = await fetchTeacherDashboardData();
        setChats(response?.data.chatData);
        setEvents(formatEvents(response?.data.events));
        setTeacherSubjects(response?.data.teacherSubjects);
      }catch(err){
        // Handled by axios interceptor
      }finally{
        setLoading(false);
      }
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

  return (
    <div className="flex grow w-full h-[90vh] bg-transparent relative">
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 h-full hidden md:block">
        <LeftSidebar chatData={chats} setChatData={setChats} />
      </div>
      <div className="w-full md:w-[70%] lg:w-[60%] h-[calc(100vh-100px)] mt-5">
        <TeacherHomeContent teacherSubjects={teacherSubjects} />
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700 hidden lg:block">
        <RightSidebar events={events} isLoading={loading} />
      </div>

      {/* Floating Chat Button - Mobile only */}
      {!isChatOpen && (
        <ShowChatsButton
          isShown={showChatButton}
          onClick={() => setIsChatOpen(true)}
          unreadCount={totalUnread}
        />
      )}

      {/* Mobile Chat Drawer/Modal */}
      {isChatOpen && (
        <div className="fixed tablet:hidden inset-0 top-15 z-20 bg-transparent w-full h-full">
          <div className="w-full h-full relative overflow-y-auto">
            <IconTextButton
              buttonProps={{ onClick: () => setIsChatOpen(false) }}
              className="absolute top-9 right-3 size-8 p-0 rounded-full"
              icon={<FontAwesomeIcon icon={faXmark} className="text-lg" />}
            />
            <div className="h-full bg-transparent rounded-md shadow-md">
              <LeftSidebar chatData={chats} setChatData={setChats} isMobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
