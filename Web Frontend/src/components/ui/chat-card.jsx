import React, { useState, useEffect} from "react";
import { SmilePlus, Send, MoreHorizontal, Check, CheckCheck } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { useSocket } from "@/context/SocketContext";
import AvatarIcon from "./AvatarIcon";

const ChatCard = ({
  chatName = "Team Chat",
  avatar = null,
  chatId=null,
  membersCount = 3,
  onlineCount = 2,
  initialMessages = [],
  currentUser = {
    _id: null,
    fullName: "You",
    username: null,
    avatar: null,
  },
  onSendMessage= ()=>{},
  onReaction=()=>{},
  onMoreClick=()=>{},
  className,
}) => {
  const {socket} = useSocket();
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Setting initial message
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleIncoming = (message) => {
      if(message.sender == currentUser._id) return;
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleIncoming);
    return () => socket.off("receiveMessage", handleIncoming);
  }, [socket]);



  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: {
        _id: currentUser._id,
        fullName: currentUser.fullName,
        avatar: currentUser.avatar,
        isOnline: true,
        isCurrentUser: true,
      },
      updatedAt: new Date(),
      status: "sent",
    };


    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    onSendMessage(inputValue,attachments);

    // Simulate message delivery and read status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg))
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg))
      );
    }, 2000);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message._id === messageId) {
          const existingReaction = message.reactions?.find((r) => r.emoji === emoji);
          const newReactions = message.reactions || [];

          if (existingReaction) {
            return {
              ...message,
              reactions: newReactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                  : r
              ),
            };
          } else {
            return {
              ...message,
              reactions: [...newReactions, { emoji, count: 1, reacted: true }],
            };
          }
        }
        return message;
      })
    );
    onReaction?.(messageId, emoji);
  };

  return (
    <div className={`chat-card w-full max-w-md mx-auto bg-customLightBg2 dark:bg-gray-900 text-white rounded-lg overflow-hidden ${className}`}>
      <div className="chat-card-header flex justify-between p-4 bg-customLightBg2 dark:bg-gray-900">
        <div className="chat-info flex gap-3 items-center">
          <div className="avatar relative w-9 h-9 rounded-full flex items-center justify-center">
            <AvatarIcon withHover={false} user={{"fullName":chatName, avatar}} />
            <div className="status-indicator absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-customLightBg2 dark:border-gray-900"></div>
          </div>
          <div className="chat-name">
            <h3 className="text-lg font-semibold text-black dark:text-white">{chatName}</h3>
            <p className="text-sm text-gray-400">
              {membersCount} members • {onlineCount} online
            </p>
          </div>
        </div>
        <button className="more-btn p-2" onClick={onMoreClick}>
          <MoreHorizontal className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <div className="chat-messages p-4 space-y-4 overflow-y-auto h-96">
        {messages.length === 0 ? (
    <div className="text-center text-gray-400 dark:text-gray-500">No messages yet</div>
  ) : (
    messages.map((message) => (
      <div key={message.id} className="message flex gap-3 items-start">
        <div className="w-9 h-9 rounded-full">
          <AvatarIcon withHover={false} user={{"fullName":message.sender.username, avatar:message.sender.avatar}} />
        </div>
        <div className="message-content flex flex-col">
          <div className="message-header flex justify-between text-sm text-gray-400 gap-3">
            <span className="sender-name text-black dark:text-white font-bold break-words flex-grow">{message.sender.fullName}</span>
            <span className="timestamp shrink-0">{formatDate(message.updatedAt)}</span>
          </div>
          <p className="message-text text-black dark:text-white">{message.content}</p>
          <div className="reactions flex space-x-2 mt-1">
            {["👍", "❤️", "😂"].map((emoji) => {
              const reaction = message.reactions?.find((r) => r.emoji === emoji);
              return (
                <button
                  key={emoji}
                  onClick={() => handleReaction(message._id, emoji)}
                  className="reaction-btn flex items-center space-x-1 text-gray-600 dark:text-gray-300"
                >
                  <span>{emoji}</span>
                  <span>{reaction?.count ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ))
  )}
      </div>

      <div className="chat-input flex items-center gap-2 p-4 bg-customLightBg2 dark:bg-gray-900">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Write a message..."
          className="flex-grow p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-customDarkFg placeholder-gray-400 focus:outline-none"
        />
        <button onClick={handleSendMessage} className="send-btn p-2 rounded-full bg-green-500 hover:bg-green-400">
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatCard;
