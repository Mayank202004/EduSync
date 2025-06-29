import React, {useState, useEffect} from "react";
import ExpandableItem from "../../ui/ExpandableItem";
import ExpandableItemChild from "./ExpandableItemChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { useSocket } from "@/context/SocketContext";


const LeftSidebar = ({ chatData }) => {
  //Hooks
  const {unreadCounts,setUnreadCounts} = useSocket();
  useEffect(() => {
    if (!chatData) return;
    const counts = {};
    const allChats = [
      ...(chatData?.announcements || []),
      ...(chatData?.sectionChats || []),
      ...(chatData?.personalChats || [])
    ];

    allChats.forEach((chat) => {
      const chatId = chat._id;
      if (chatId) counts[chatId] = chat.unreadMessageCount || 0;
    });

    setUnreadCounts(counts);
  }, [chatData]);

  const handleUnreadReset = (chatId) => {
    setUnreadCounts((prev) => ({ ...prev, [chatId]: 0 }));
  };

  
  // if (!chatData) return <div>Loading Sidebar...</div>; // To do : add skeleton loading
  return (
    <div className="max-w-17/20 p-5 text-sm my-5 mx-auto bg-white dark:bg-customDarkFg rounded-md overflow-y-auto">
      <div className="flex items-center justify-center gap-2 align-middle mb-3 px-3">
        <FontAwesomeIcon
          icon={faMessage}
          className="dark:text-white text-black text-1.5xl"
        />
        <h2 className="font-semibold text-1.5xl">Channels</h2>
      </div>

      {/* Announcements Chats */}
      {chatData?.announcements && (
        <ExpandableItem title="Announcements" defaultExpanded={true}>
          <ExpandableItemChild
            title={chatData?.announcements[0]?.name ?? "Unnamed Channel"}
            subtitle={`${chatData?.announcements[0]?.participantsCount} Members`}
            chatId={chatData?.announcements[0]?._id}
            unreadCount={unreadCounts[chatData?.announcements[0]?._id] || 0}
            onUnreadReset={handleUnreadReset}
          />
        </ExpandableItem>
      )}

      {/* Section Chats */}
      {chatData?.sectionChats && (
        <ExpandableItem title="Sections" defaultExpanded={true}>
          {chatData.sectionChats.map((item, index) => (
            <ExpandableItemChild
              key={index}
              title={item.name ?? "Unnamed Channel"}
              subtitle={`${item.participantsCount} Members`}
              chatId={item._id}
              unreadCount={unreadCounts[item._id] || 0}
              onUnreadReset={handleUnreadReset}
            />
          ))}
        </ExpandableItem>
      )}

      {/* Direct Messages */}
      <h2 className="font-semibold mb-2 mt-4">Direct Messages</h2>
      <input
        type="text"
        placeholder="Search for people"
        className="w-full p-1 mb-2 border rounded placeholder:text-gray-700 dark:placeholder:text-gray-300"
      />
      {chatData?.personalChats.map((item, index) => {
        const isStudentView = !!item.teacher;
        const person = isStudentView ? item.teacher : item.student;

        return (
          <ExpandableItemChild
            key={index}
            title={person?.name ?? "Unknown"}
            subtitle={
              isStudentView
                ? person?.subjects?.join(", ") ?? "No subjects"
                : "Student"
            }
            avatar={person?.avatar}
            chatId={item._id}
            userId={person?._id}
            unreadCount={unreadCounts[item._id] || 0}
            onUnreadReset={handleUnreadReset}
          />
        );
      })}
    </div>
  );
};

export default LeftSidebar;
