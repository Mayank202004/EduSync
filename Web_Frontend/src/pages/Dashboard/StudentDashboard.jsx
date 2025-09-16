import React from "react";
import { useState, useEffect } from "react";
import { useChatsPanel } from "@/hooks/useChatsPanel";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeftSidebar from "@/components/Home/Sidebar/LeftSidebar";
import RightSidebar from "@/components/Home/Sidebar/RightSidebar";
import HomeContent from "@/components/Home/StudentComponents/HomeContent";
import ShowChatsButton from "@/components/Home/ShowChatsButton";
import IconTextButton from "@/components/Chat/IconTextButton";
import { fetchStudentDashboardData } from "@/services/dashboardService";
import { formatEvents } from "@/utils/calendarUtil";
import { useSocket } from "@/context/SocketContext";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [chats, setChats] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [attendanceOverMonths, setAttendanceOverMonths] = useState(null);
  const [events, setEvents] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showChatButton } = useChatsPanel();
  const { unreadCounts, setUnreadCounts } = useSocket();

  // Sum all chat unread counts (Used for mobile screen floating chat button)
  const totalUnread = Object.values(unreadCounts || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetchStudentDashboardData();
        setChats(response?.data.chatData);
        setAttendanceOverMonths(response?.data?.monthlyAttendancePercentage);
        setMonthlyAttendance(response?.data?.attendanceForTheMonth);
        setEvents(formatEvents(response?.data.events));
      } catch (err) {
        // Handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  useEffect(() => {
    if (!chats) return;
    const counts = {};
    const allChats = [
      ...(chats?.announcements || []),
      ...(chats?.sectionChats || []),
      ...(chats?.personalChats || []),
    ];
    allChats.forEach((chat) => {
      if (chat?._id) counts[chat._id] = chat.unreadMessageCount || 0;
    });
    setUnreadCounts(counts);
  }, [chats]);


  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = ""; // Restore scroll
    }
  }, [isChatOpen]);

  return (
    <div className="flex w-full  h-full md:h-[90vh] bg-transparent relative">
      {/* Left Sidebar */}
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 hidden md:block">
        <LeftSidebar chatData={chats} setChatData={setChats} />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[70%] lg:w-[60%] h-[calc(100vh-100px)] mt-5 px-4">
        <HomeContent
          monthlyAttendance={monthlyAttendance}
          attendanceOverMonths={attendanceOverMonths}
        />
      </div>

      {/* Right Sidebar */}
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
        <div className="fixed inset-0 top-15 backdrop-blur-md z-50 flex justify-end md:hidden">
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

export default StudentDashboard;
