import React, { useState, useEffect } from "react";
import ExpandableItem from "../../Chat/ExpandableItem";
import ExpandableItemChild from "./ExpandableItemChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { useSocket } from "@/context/SocketContext";
import { getChatMessages } from "@/services/chatService";
import { useAuth } from "@/context/AuthContext";
import useClickOutside from "@/hooks/useClickOutside";
import ChatCard from "@/components/Chat/chat-card";
import { getOrCreatePersonalChat } from "@/services/chatService";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";

const LeftSidebar = ({ chatData, setChatData, isMobile = false, searchUsers = [] }) => {
  const { unreadCounts, setUnreadCounts, socket, activeChatId, setActiveChat } = useSocket();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const CURRENT_USER = {
    _id: user?._id,
    fullName: user?.fullName,
    username: user?.username,
    avatar: user?.avatar,
    role: user.role,
  };

  const handleUnreadReset = (chatId) => {
    setUnreadCounts((prev) => ({ ...prev, [chatId]: 0 }));
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChats(chatData?.personalChats || []);
    } else {
      const filtered = (chatData?.personalChats || []).filter((item) => {
        const person = item.teacher || item.student;
        return person?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredChats(filtered);
    }
  }, [searchTerm, chatData]);

  // Create new chat if no personal chat exists (On receive)
  useEffect(() => {
    if (!socket || !user) return;
    const handleNotify = ({ chatId, from, content }) => {
      const isExisting = (chatData?.personalChats || []).some(chat => chat._id === chatId);

      if (isExisting) return;

      const newChat = {
        _id: chatId,
        participants: [from, CURRENT_USER],
        updatedAt: new Date().toISOString(),
        unreadMessageCount: 1,
        student: from.role === "student" ? from : undefined,
        teacher: from.role === "teacher" ? from : undefined,
        user: from ?? undefined,
        userId: from?._id
      };

      setChatData(prev => ({
        ...prev,
        personalChats: [newChat, ...(prev?.personalChats || [])],
      }));
    };

    socket.on("notifyNewMessage", handleNotify);
    return () => socket.off("notifyNewMessage", handleNotify);
  }, [socket, user, chatData, setChatData]);



  const handleUserClick = async (targetUser) => {
    setSearchTerm("");
    setShowDropdown(false);

    // 1. Check if personal chat already exists
    const existingChat = (chatData?.personalChats || []).find((chat) => {
      const other = chat.teacher || chat.student;
      return other?._id === targetUser._id;
    });
    if (existingChat) {
      const person = existingChat.teacher || existingChat.student;
      handleChatOpen({
        chatId: existingChat._id,
        title: person?.name,
        avatar: person?.avatar,
        memberCount: existingChat.participants?.length,
        userId: person?._id,
        participants: existingChat.participants,
        unreadCount: unreadCounts[existingChat._id] || 0,
      });
    } else {
      try {
        // Fetch or create new personal chat from API
        const res = await getOrCreatePersonalChat(CURRENT_USER._id, targetUser._id);
        const chat = res.data;

        if (chat && chat._id) {
          setChatData(prev => ({
            ...prev,
            personalChats: [chat, ...(prev?.personalChats || [])],
          }));

          handleChatOpen({
            chatId: chat._id,
            title: targetUser.fullName,
            avatar: targetUser.avatar,
            memberCount: chat.participants?.length,
            userId: targetUser._id,
            participants: chat.participants,
            unreadCount: 0,
          });
        }
      } catch (err) {
      }
    }
  };


  const handleChatOpen = async (chat) => {
    if (!chat?.chatId) return;

    socket?.emit("joinChat", { chatId: chat.chatId });

    if (chat.unreadCount > 0) {
      socket?.emit("chatRead", { chatId: chat.chatId, userId: CURRENT_USER._id });
      handleUnreadReset(chat.chatId);
    }

    setActiveChat(chat.chatId);
    setSelectedChat(chat);
    setShowPopup(true);

    try {
      setLoadingMessages(true);
      const res = await getChatMessages(chat.chatId);
      setMessages(res.data || []);
    } catch (err) {
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleChatClose = () => {
    if (socket && socket.connected && selectedChat?.chatId) {
      socket.emit("leaveChat", selectedChat.chatId);
    }
    setActiveChat(null);
    setShowPopup(false);
    setMessages([]);
    setSelectedChat(null);
  };

  const [containerRef] = useClickOutside(handleChatClose);

  return (
    <div className={cn("p-5  text-sm my-5 mx-auto bg-white dark:bg-customDarkFg rounded-md overflow-y-auto h-[calc(100%-30px)] flex flex-col", isMobile ? "w-full my-0 h-[calc(100%-60px)]" : "max-w-17/20")}>
      <div className="flex items-center justify-center gap-2 mb-3 px-3">
        <FontAwesomeIcon icon={faMessage} className="dark:text-white text-black text-1.5xl" />
        <h2 className="font-semibold text-1.5xl">Channels</h2>
      </div>

      {/* Announcements */}
      {chatData?.announcements?.length > 0 && (
        <ExpandableItem title="Announcements" defaultExpanded>
          <ExpandableItemChild
            title={chatData.announcements[0]?.name ?? "Unnamed Channel"}
            subtitle={`${chatData.announcements[0]?.participants?.length} Members`}
            memberCount={chatData.announcements[0]?.participants?.length}
            chatId={chatData.announcements[0]?._id}
            participants={chatData.announcements[0]?.participants}
            unreadCount={unreadCounts[chatData.announcements[0]?._id] || 0}
            onUnreadReset={handleUnreadReset}
            onClick={() =>
              handleChatOpen({
                chatId: chatData.announcements[0]?._id,
                title: chatData.announcements[0]?.name,
                avatar: chatData.announcements[0]?.avatar,
                memberCount: chatData.announcements[0]?.participants?.length,
                participants: chatData.announcements[0]?.participants,
                unreadCount: unreadCounts[chatData.announcements[0]?._id] || 0,
              })
            }
          />
        </ExpandableItem>
      )}

      {/* Section Chats */}
      {chatData?.sectionChats?.length > 0 && (
        <ExpandableItem title="Sections" defaultExpanded>
          {chatData.sectionChats.map((item, index) => (
            <ExpandableItemChild
              key={index}
              title={item.name ?? "Unnamed Channel"}
              subtitle={`${item.participants?.length} Members`}
              memberCount={item.participants?.length}
              chatId={item._id}
              participants={item.participants}
              unreadCount={unreadCounts[item._id] || 0}
              onUnreadReset={handleUnreadReset}
              onClick={() =>
                handleChatOpen({
                  chatId: item._id,
                  title: item?.name,
                  avatar: item?.avatar,
                  memberCount: item.participants?.length,
                  participants: item.participants,
                  unreadCount: unreadCounts[item._id] || 0,
                })
              }
            />
          ))}
        </ExpandableItem>
      )}

      {/* Direct Messages */}
      <h2 className="font-semibold mb-2 mt-4">Direct Messages</h2>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search for people"
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full p-1 mb-2 border rounded placeholder:text-gray-700 dark:placeholder:text-gray-300"
        />
        {showDropdown && searchTerm.trim() && (
          <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-zinc-900 border rounded shadow-md">
            {searchUsers
              .filter((user) =>
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user, idx) => (
                <li
                  key={user._id ?? idx}
                  onClick={() => handleUserClick(user)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700"
                >
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="overflow-y-auto flex-grow pr-1 mt-1 max-h-[320px] ">
        {filteredChats.length > 0 ? (
          filteredChats.map((item, index) => {
            const person = item.teacher || item.student || item.user;

            return (
              <ExpandableItemChild
                key={index}
                title={person?.name || person?.fullName || "Unknown"}
                subtitle={
                  item.teacher
                    ? person?.subjects?.join(", ") || "No subjects"
                    : item.student
                      ? "Student"
                      : item.user?.role
                        ? item.user.role
                        : "User"
                }
                avatar={person?.avatar}
                chatId={item._id}
                userId={person?._id}
                participants={item.participants}
                unreadCount={unreadCounts[item._id] || 0}
                onUnreadReset={handleUnreadReset}
                onClick={() =>
                  handleChatOpen({
                    chatId: item._id,
                    title: person?.name,
                    avatar: person?.avatar,
                    memberCount: item.participants?.length,
                    userId: person?._id,
                    participants: item.participants,
                    unreadCount: unreadCounts[item._id] || 0,
                  })
                }
              />
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400 px-1">
            No Previous Interactions
          </p>
        )}
      </div>

      {/* Chat Popup */}
      {showPopup && selectedChat && (
        <div className="fixed bottom-0 left-0 mb-4 ml-4 z-50">
          <div ref={containerRef} className="bg-transparent dark:bg-transparent p-4 w-96 relative">
            <button
              onClick={handleChatClose}
              className="absolute top-2 right-2 text-black dark:text-white bg-white dark:bg-gray-600 hover:bg-gray-500 p-2 rounded-full"
            >
              X
            </button>
            <ChatCard
              chatName={selectedChat.title}
              avatar={selectedChat.avatar}
              chatId={selectedChat.chatId}
              membersCount={selectedChat.memberCount}
              initialMessages={messages}
              loading={loadingMessages}
              currentUser={CURRENT_USER}
              userId={selectedChat.userId}
              participants={selectedChat.participants}
              className="border border-zinc-200 dark:border-zinc-700"
              onSendMessage={(content, attachments) => {
                socket.emit("sendMessage", {
                  chatId: selectedChat.chatId,
                  content,
                  attachments,
                });
              }}
              onSendMeetingInvitation={(type, content, meetingTime) => {
                try {
                  socket.emit("sendMeetingInvitation", {
                    chatId: selectedChat.chatId,
                    content,
                    type, // "now" or "later"
                    time: meetingTime
                  });
                } catch (err) {
                  toast.error(err.message);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
