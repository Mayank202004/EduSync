import React, { useState, useEffect} from "react";
import ChatCard from "/src/components/Chat/chat-card.jsx";
import { getChatMessages } from "@/services/chatService";
import useClickOutside from "@/hooks/useClickOutside";
import { useSocket} from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import AvatarIcon from "@/components/Chat/AvatarIcon";

const ExpandableItemChild = React.memo(({ title, subtitle,memberCount=0, avatar, chatId, unreadCount, onUnreadReset, userId, participants, onClick}) => {
  const isOnline = userId ? useOnlineStatus(userId) : false;
  
  const handleClick = () => {
    onClick?.({
      chatId,
      title,
      subtitle,
      memberCount,
      avatar,
      userId,
      participants,
      unreadCount
    });
  };


  return (
    <div>
      <div
        className="flex items-center justify-between mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 duration-200 rounded cursor-pointer"
        onClick={handleClick}
      >
        {/* Left: Avatar + Text */}
        <div className="flex items-center space-x-2">
          {/* Avatar */}
          <div className="avatar relative w-9 h-9 rounded-full flex items-center justify-center">
            <AvatarIcon withHover={false} user={{ fullName: title, avatar }} />
            {isOnline && <div className="status-indicator absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-customLightBg2 dark:border-gray-900"></div>}
          </div>

          {/* Name & subtitle */}
          <div className="flex flex-col text-sm">
            <span className="font-medium">{title}</span>
            <span className="text-gray-500 dark:text-gray-300 text-xs">{subtitle}</span>
          </div>
        </div>

        {/* Right: Unread badge */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-center bg-red-500 text-white text-xs h-5 min-w-5 px-2 rounded-full ml-2">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </div>

      
    </div>
  );
});

export default ExpandableItemChild;
