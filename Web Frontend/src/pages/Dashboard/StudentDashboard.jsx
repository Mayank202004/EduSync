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

const StudentDashboard = () => {
  const [chats, setChats] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [attendanceOverMonths, setAttendanceOverMonths] = useState(null);
  const [events, setEvents] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { showChatButton } = useChatsPanel();

  useEffect(() => {
    const getDashboardData = async () => {
      const response = await fetchStudentDashboardData();
      setChats(response?.data.chatData);
      setAttendanceOverMonths(response?.data?.monthlyAttendancePercentage);
      setMonthlyAttendance(response?.data?.attendanceForTheMonth);
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

  return (
    <div className="flex grow w-full min-h-full bg-transparent relative">
      {/* Left Sidebar - Desktop only */}
      <div className="md:w-[30%] lg:w-[20%] border-r border-gray-200 dark:border-gray-700 h-full pb-10 hidden md:block">
        <LeftSidebar chatData={chats} setChatData={setChats} />
      </div>
      <div className="w-full md:w-[70%] lg:w-[60%] p-4 overflow-y-auto">
        <HomeContent
          monthlyAttendance={monthlyAttendance}
          attendanceOverMonths={attendanceOverMonths}
        />
      </div>
      <div className="w-[20%] border-l border-gray-200 dark:border-gray-700 hidden pb-10 lg:block">
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
