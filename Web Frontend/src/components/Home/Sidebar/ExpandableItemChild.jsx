import React, { useState, useEffect} from "react";
import ChatCard from "/src/components/ui/chat-card.jsx";
import { getChatMessages } from "@/services/chatService";
import useClickOutside from "@/hooks/useClickOutside";
import { useSocket} from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

const ExpandableItemChild = ({ title, subtitle, avatar, chatId}) => {
  const { socket, activeChatId,setActiveChat} = useSocket();
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { user } = useAuth();

  const CURRENT_USER = {
    _id: user?._id,
    fullName: user?.fullName,
    username: user?.username,
    avatar: user?.avatar || "src/assets/avatar.png", // Default avatar if none is provided To Do
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
        className="flex items-center mb-2 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-600 duration-200 rounded cursor-pointer"
        onClick={handleClick} // Open popup on click
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
          {avatar || title.charAt(0)}
        </div>

        {/* Text content */}
        <div className="flex flex-col text-sm">
          <span className="font-medium">{title}</span>
          <span className="text-gray-500 dark:text-gray-300 text-xs">{subtitle}</span>
        </div>
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
};

export default ExpandableItemChild;
