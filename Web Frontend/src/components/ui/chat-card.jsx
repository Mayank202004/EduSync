import React, { useState, useEffect} from "react";
import { SmilePlus, Send, MoreHorizontal, Check, CheckCheck, Paperclip } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { useSocket } from "@/context/SocketContext";
import { uploadFiles } from "@/services/chatService";
import AvatarIcon from "./AvatarIcon";
import toast from "react-hot-toast";

const ChatCard = ({
  chatName = "Team Chat",
  avatar = null,
  chatId=null,
  membersCount = 3,
  initialMessages = [],
  userId=null,
  participants=[],
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
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);


  // Setting initial message
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleIncoming = (message) => {

      if(message.sender?._id == currentUser._id) return;
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleIncoming);
    return () => socket.off("receiveMessage", handleIncoming);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    
    const setInitialOnlineUsers = ({ _id, onlineUserIds }) => {
      if(_id != chatId) return;
      if(!onlineUserIds) return;
      setOnlineUsers(onlineUserIds);
    };
  
    const handleUserConnected = (id) => {
      console.log(`Connected Id is : ${id}`)
      const isParticipant = participants.includes(id);
      if (!isParticipant) return;
    
      setOnlineUsers((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };
  
    const handleUserDisconnected = (id) => {
      console.log(`User ${id} disconnected`);
      setOnlineUsers((prev) => prev.filter((uid) => uid !== id));
    };
  
    socket.on("initialOnlineUsers", setInitialOnlineUsers);
    socket.on("userConnected", handleUserConnected);
    socket.on("userDisconnected", handleUserDisconnected);
  
    return () => {
      socket.off("initialOnlineUsers", setInitialOnlineUsers);
      socket.off("userConnected", handleUserConnected);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, [socket, chatId, participants]);



  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    setIsUploading(true); 
    try {
      let uploadedFiles = [];

      if (attachments.length > 0) {
        uploadedFiles = await uploadFiles(attachments);
      }

      const newMessage = {
        id: Date.now().toString(),
        content: inputValue,
        attachments: uploadedFiles, 
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

      // Update local UI instantly
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      setAttachments([]);

      // Emit/send to backend
      onSendMessage(inputValue, uploadedFiles);
    } catch (err) {
      console.error(err);
      alert("Failed to upload attachments. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
            {onlineUsers.length == participants.length && <div className="status-indicator absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-customLightBg2 dark:border-gray-900"></div>}
          </div>
          <div className="chat-name">
            <h3 className="text-lg font-semibold text-black dark:text-white">{chatName}</h3>
            <p className="text-sm text-gray-400">
              {userId
                ? onlineUsers.includes(userId)
                  ? "Online"
                  : ""
                : `${membersCount} members • ${onlineUsers.length} online`}
            </p>
          </div>
        </div>
        <button className="more-btn p-2" onClick={onMoreClick}>
          <MoreHorizontal className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <div className={`chat-messages p-4 space-y-4 overflow-y-auto  ${attachments.length > 0 ? "h-72" : "h-96"}`}>
        {messages === null ? (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div key={message._id || message.id} className="message flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full">
                <AvatarIcon
                  withHover={false}
                  user={{
                    fullName: message.sender.fullName,
                    avatar: message.sender.avatar,
                  }}
                />
              </div>
                
              <div className="message-content flex flex-col">
                <div className="message-header flex justify-between text-sm text-gray-400 gap-3">
                  <span className="sender-name text-black dark:text-white font-bold break-words flex-grow">
                    {message.sender.fullName}
                  </span>
                  <span className="timestamp shrink-0">{formatDate(message.updatedAt)}</span>
                </div>
                
                {/* Message Content */}
                {message.content && (
                  <p className="message-text text-black dark:text-white whitespace-pre-line">
                    {message.content}
                  </p>
                )}
          
                {/* Message Attachments */}
                {message.attachments?.length > 0 && (
                  <div className="attachments grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {message.attachments.map((file, idx) => {
                      const isObject = typeof file !== "string";
                      const fileType = isObject ? file.type : "";
                      const isImage = isObject
                        ? fileType.startsWith("image/")
                        : file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                      const url = file.url;
                    
                      return (
                        <div key={idx} className="attachment-item text-sm">
                          {isImage ? (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={`attachment-${idx}`}
                                className="rounded-lg border max-h-48 w-full object-cover hover:opacity-80 transition"
                              />
                            </a>
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded"
                            >
                              📄 <span className="truncate max-w-[80%]">
                              {file.name || `File-${idx + 1}`} ({Math.round(file.size / 1024)} KB)</span>

                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
          
                {/* Message Reactions */}
                <div className="reactions flex space-x-2 mt-1">
                  {["👍", "❤️", "😂"].map((emoji) => {
                    const reaction = message.reactions?.find((r) => r.emoji === emoji);
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(message._id || message.id, emoji)}
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

      {attachments.length > 0 && (
        <div className="attachments-preview flex flex-wrap gap-2 mt-2 px-4">
          {attachments.slice(0, 3).map((file, idx) => {
            const isImage = file.type.startsWith("image/");
            return (
              <div
                key={idx}
                className={`relative p-2 border rounded bg-white dark:bg-gray-800 ${
                  isImage ? "w-16 h-16" : "w-full"
                }`}
              >
                {isImage ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-300 w-full overflow-hidden">
                    📄
                    <span className="truncate max-w-[80%]">{file.name}</span>
                  </div>
                )}
                <button
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            );
          })}
      
          {/* +N More Card */}
          {attachments.length > 3 && (
            <div className="w-16 h-16 p-2 border rounded bg-white dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium text-sm">
              +{attachments.length - 3}
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400">
          Uploading files...
        </div>
      )}


      <div className="chat-input flex items-center gap-2 p-4 bg-customLightBg2 dark:bg-gray-900">
        {/* Attachment Button */}
        <label className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer">
          <Paperclip className="w-5 h-5 text-white" />
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const maxFiles = 10;
              const maxSizeMB = 5;
            
              const selectedFiles = Array.from(e.target.files);
              const validFiles = [];
            
              for (const file of selectedFiles) {
                if (file.size > maxSizeMB * 1024 * 1024) {
                  toast.error(`${file.name} exceeds the ${maxSizeMB}MB limit and was skipped.`);
                  continue;
                }
                validFiles.push(file);
              }
            
              setAttachments((prev) => {
                const totalFiles = [...prev, ...validFiles];
                if (totalFiles.length > maxFiles) {
                  toast.error(`You can upload a maximum of ${maxFiles} files.`);
                  return totalFiles.slice(0, maxFiles);
                }
                return totalFiles;
              });
              e.target.value = null; 
            }}
          />
        </label>
          
        {/* Text Input */}
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

        {/* Send Button */}
        <button onClick={handleSendMessage} className="send-btn p-2 rounded-full bg-green-500 hover:bg-green-400">
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

// Loading  message skeleton 
const MessageSkeleton = () => (
  <div className="message flex gap-3 items-start animate-pulse">
    <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700" />
    <div className="flex flex-col space-y-2 flex-1">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
    </div>
  </div>
);


export default ChatCard;
