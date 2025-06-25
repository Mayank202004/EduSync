import React, { useState, useEffect} from "react";
import ChatCard from "/src/components/ui/chat-card.jsx";
import { getChatMessages } from "@/services/chatService";
import useClickOutside from "@/hooks/useClickOutside";
import { useSocket} from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import AvatarIcon from "@/components/ui/AvatarIcon";

const ExpandableItemChild = React.memo(({ title, subtitle, avatar, chatId, unreadCount, userId}) => {
  const isOnline = userId ? useOnlineStatus(userId) : false;
  const { socket, activeChatId,setActiveChat} = useSocket();
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { user } = useAuth();

  const CURRENT_USER = {
    _id: user?._id,
    fullName: user?.fullName,
    username: user?.username,
    avatar: user?.avatar,
  };

/**
 * @desc Opens the chat popup on click
 */  
const handleClick = () => {
  if (socket && socket.connected) {
    socket.emit("joinChat", chatId);
  }
  setActiveChat(chatId); 
  setShowPopup(true);
};

/**
 * @desc Closes the chat popup 
 */
  const handleClosePopup = () => {
    if (socket && socket.connected) {
      socket.emit("leaveChat", chatId); 
    }
    setActiveChat(null);
    setShowPopup(false); 
  };

  const [containerRef] = useClickOutside(handleClosePopup);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !showPopup) return;
      setLoadingMessages(true);
      try {
        const response = await getChatMessages(chatId);
        setMessages(response.data || []);
      } catch (err) {
          console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [showPopup, chatId]);

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

      {/* Popup for Chat Screen */}
      {showPopup && (
        <div className="fixed bottom-0 left-0 mb-4 ml-4 z-50">
          <div ref={containerRef} className="bg-transparent dark:bg-transaparent p-4 w-96 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-black dark:text-white bg-white dark:bg-gray-600 hover:bg-gray-500 p-2 rounded-full"
            >
              X
            </button>
            <ChatCard
              chatName={title}
              avatar={avatar}
              chatId={activeChatId.current}
              membersCount={1}
              onlineCount={1}
              initialMessages={messages}
              loading={loadingMessages}
              currentUser={CURRENT_USER}
              className="border border-zinc-200 dark:border-zinc-700"
              onSendMessage={
                (content,attachments) => {
                  socket.emit("sendMessage", { chatId:activeChatId.current, content, attachments });
                }
              }
              onReaction={(messageId, emoji) => console.log("Reaction:", messageId, emoji)}
              onMoreClick={() => console.log("More clicked")}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default ExpandableItemChild;
