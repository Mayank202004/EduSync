import React, { useState, useEffect, useRef } from "react";
import {
  SmilePlus,
  Send,
  MoreHorizontal,
  Check,
  CheckCheck,
  Paperclip,
  VideoIcon,
  Video,
} from "lucide-react";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "@/utils/dateUtils";
import { useSocket } from "@/context/SocketContext";
import { uploadFiles } from "@/services/chatService";
import AvatarIcon from "./AvatarIcon";
import Typing from "./Typing";
import toast from "react-hot-toast";
import useDebouncedTyping from "@/hooks/useDebouncedTyping";
import ImagePreview from "./ImagePreview";
import ScheduleMeetingOptions from "./ScheduleMeetingOptions";
import { useNavigate } from "react-router-dom";

const ChatCard = ({
  chatName = "Team Chat",
  avatar = null,
  chatId = null,
  membersCount = 3,
  initialMessages = [],
  userId = null,
  participants = [],
  currentUser = {
    _id: null,
    fullName: "You",
    username: null,
    avatar: null,
  },
  onSendMessage = () => {},
  onSendMeetingInvitation = () => {},
  className,
}) => {
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState(""); // Used to track input value (Message typed)
  const [attachments, setAttachments] = useState([]); // Used to track/set attachments
  const [onlineUsers, setOnlineUsers] = useState([]); // Used to track all online users
  const [isUploading, setIsUploading] = useState(false); // Used to track upload status
  const [typingUsers, setTypingUsers] = useState([]); // Used to track all users data those are typing currently
  const chatMessagesRef = useRef(null); // used to track messages scroll value
  const [previewDetails, setPreviewDetails] = useState(null);
  const [showScheduleMeetingOptions, setShowScheduleMeetingOptions] = useState(false);


  // Setting initial message
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handleIncoming = (message) => {
      if (message.sender?._id == currentUser._id) return;
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleIncomingMeetingInvitation = (message) => {
      if (message.chatId !== chatId) return;
      setMessages((prev) => [...prev, message]);
      if (
        message.type === "now" &&
        message.sender?._id === currentUser._id
      ) {
        navigate(`/meeting/${message.meetingId}`); // Instantly open meeting if (sender is the receiver and type is now)
      }
    };
    socket.on("receiveMessage", handleIncoming);
    socket.on("receiveMeetingInvitation", handleIncomingMeetingInvitation);
    return () => {
      socket.off("receiveMessage", handleIncoming);
      socket.off("receiveMeetingInvitation", handleIncomingMeetingInvitation);
    }
  }, [socket, chatId, currentUser._id]);

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    const setInitialOnlineUsers = ({ _id, onlineUserIds }) => {
      if (_id != chatId) return;
      if (!onlineUserIds) return;
      setOnlineUsers(onlineUserIds);
    };

    const handleUserConnected = (id) => {
      const isParticipant = participants.includes(id);
      if (!isParticipant) return;

      setOnlineUsers((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const handleUserDisconnected = (id) => {
      console.log(`User ${id} disconnected`);
      setOnlineUsers((prev) => prev.filter((uid) => uid !== id));
    };

    const handleUserTyping = ({ chatId: incomingChatId, user }) => {
      if (incomingChatId !== chatId) return;
      setTypingUsers((prev) => {
        const exists = prev.some((u) => u._id === user._id);
        return exists ? prev : [...prev, user];
      });
    };

    const handleUserStoppedTyping = ({ chatId: incomingChatId, userId }) => {
      if (incomingChatId !== chatId) return;
      setTypingUsers((prev) => prev.filter((u) => u._id !== userId));
    };

    socket.on("initialOnlineUsers", setInitialOnlineUsers);
    socket.on("userConnected", handleUserConnected);
    socket.on("userDisconnected", handleUserDisconnected);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("initialOnlineUsers", setInitialOnlineUsers);
      socket.off("userConnected", handleUserConnected);
      socket.off("userDisconnected", handleUserDisconnected);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket, chatId, participants]);

  /**
   * @desc Scrolls to bottom of chat when a message is received
   */
  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  /**
   * @desc Scrolls to bottom of chat when attachments are added
   */
  useEffect(() => {
    if (attachments.length > 0) {
      scrollToBottom(true);
    }
  }, [attachments]);

  /**
   * @desc Scrolls to bottom of chat when typing users are updated
   */
  useEffect(() => {
    if (typingUsers.length > 0) {
      scrollToBottom(); // respects the "only scroll if near bottom"
    }
  }, [typingUsers]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    setIsUploading(true);
    try {
      let uploadedFiles = [];

      if (attachments.length > 0) {
        uploadedFiles = await uploadFiles(attachments);
      }

      const newMessage = {
        _id: Date.now().toString(),
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

  const handleSendMeetingInvitation = async (type,content, meetingTime) => {
    onSendMeetingInvitation(type, content,meetingTime);
  };


  const handleTypingDebounced = useDebouncedTyping(socket, chatId, {
    _id: currentUser._id,
    fullName: currentUser.fullName,
    avatar: currentUser.avatar,
  });

  /**
   * @desc Handles typing
   * @param {Event} e
   */
  const handleTyping = (e) => {
    setInputValue(e.target.value);
    handleTypingDebounced();
  };

  /**
   * @desc Scrolls to bottom of chat
   * @param {Bool} force - True if forcefully scroll to bottom / False if scroll only when user is at bottom
   * @returns {void} - Scrolls to bottom (Based on force or condition)
   */
  const scrollToBottom = (force = false) => {
    if (!force) {
      const el = chatMessagesRef.current;
      if (!el) return;

      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      if (!isNearBottom) return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // UI
  return (
    <>
        {/* Image preview Modal */}
      {previewDetails && (
        <ImagePreview
          onClose={() => setPreviewDetails(null)}
          url={previewDetails.url}
          filename={previewDetails.filename}
          header={
            <div className="flex flex-nowrap items-center gap-2">
              <AvatarIcon
                withHover={false}
                user={{
                  fullName: previewDetails.fullName,
                  avatar: previewDetails.avatar,
                }}
              />
              <div className="flex flex-col">
                <h1 className="font-semibold">{previewDetails.fullName}</h1>
                <span className="opacity-60 text-xs">
                  {formatDate(previewDetails.sentOn)}
                </span>
              </div>
            </div>
          }
        />
      )}
      {/* Actual Chat-Card Ui */}
      <div
        className={`chat-card w-full max-w-md mx-auto bg-customLightBg2 dark:bg-gray-900 text-white rounded-lg overflow-hidden h-135 flex flex-col ${className}`}
      >
        <div className="chat-card-header flex justify-between p-4 bg-customLightBg2 dark:bg-gray-900">
          <div className="chat-info flex gap-3 items-center">
            <div className="avatar relative w-9 h-9 rounded-full flex items-center justify-center">
              <AvatarIcon
                withHover={false}
                user={{ fullName: chatName, avatar }}
              />
              {onlineUsers.length == participants.length && (
                <div className="status-indicator absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-customLightBg2 dark:border-gray-900"></div>
              )}
            </div>
            <div className="chat-name">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {chatName}
              </h3>
              <p className="text-sm text-gray-400">
                {userId
                  ? onlineUsers.includes(userId)
                    ? "Online"
                    : ""
                  : `${membersCount} members • ${onlineUsers.length} online`}
              </p>
            </div>
          </div>
          <button className="more-btn p-2" onClick={() => setShowScheduleMeetingOptions(!showScheduleMeetingOptions)}>
            <Video className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
        <div className="flex flex-col flex-grow min-h-0">
          <div
            className={`chat-messages px-4 pt-4 space-y-4 overflow-y-auto  flex-grow min-h-0 max-h-96`}
            ref={chatMessagesRef}
          >
            {messages === null ? (
              <>
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500">
                No messages yet
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id || message.id}
                  className="message flex gap-3 items-start"
                >
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
                      <span className="timestamp shrink-0">
                        {formatDate(message.updatedAt)}
                      </span>
                    </div>

                    {/* Message Content */}
                    {message.content && (
                      <p className="message-text text-black dark:text-white whitespace-pre-line">
                        {message.content}
                      </p>
                    )}

                    {/* Meeting Invitation */}
                    {message.meeting?.meetingId && (
                      <div className="mt-2 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg shadow border dark:border-blue-700 sm:items-center sm:justify-between gap-3">
                        <h3 className="text-sm font-semibold mb-2 text-black dark:text-white">Invitation for Video Meeting</h3>
                        <div className="flex flex-col sm:flex-row">
                          <div className="text-sm text-gray-900 dark:text-blue-100 font-medium">
                            Meeting ID: <span className="font-mono">{message.meeting?.meetingId}</span>
                          </div>
                          {/* Time Expiry Logic */}
      {Date.now() - new Date(message.meeting.meetingTime).getTime() <= 24 * 60 * 60 * 1000 ? (
        <button
          onClick={() => navigate(`/meeting/${message.meeting.meetingId}`)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
        >
          Join Meeting
        </button>
      ) : (
        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
          Meeting ID has expired
        </span>
      )}
                        </div>
                      </div>
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
                            <div
                              key={idx}
                              className="w-fit attachment-item text-sm group rounded-lg overflow-hidden"
                            >
                              {isImage ? (
                                <>
                                  <button
                                    className="relative min-w-56 max-w-9/10 hover:opacity-80 flex object-cover cursor-pointer"
                                    onClick={() => {
                                      setPreviewDetails({
                                        fullName: message.sender.fullName,
                                        avatar: message.sender.avatar,
                                        sentOn: message.updatedAt,
                                        filename: file.name.slice(
                                          0,
                                          file.name.lastIndexOf(".")
                                        ),
                                        url,
                                      });
                                    }}
                                  >
                                    <img
                                      src={url}
                                      alt={`attachment-${idx}`}
                                      className=""
                                    />
                                    <div className="opacity-0 group-hover:opacity-100 flex absolute inset-0 items-center justify-center backdrop-blur-xs transition-all duration-200 rounded-lg gap-1.5">
                                      <FontAwesomeIcon icon={faEye} />
                                      <span>Preview</span>
                                    </div>
                                  </button>
                                </>
                              ) : (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded"
                                >
                                  📄{" "}
                                  <span className="truncate max-w-[80%]">
                                    {file.name || `File-${idx + 1}`} (
                                    {Math.round(file.size / 1024)} KB)
                                  </span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {/* Typing Indicator UI */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-3 px-1 mt-1 pl-4 shrink-0">
                {/* Avatar Stack */}
                <div className="relative w-[38px] h-6">
                  {typingUsers.slice(0, 2).map((user, index) => (
                    <div
                      key={user._id}
                      className="absolute top-0"
                      style={{ left: `${index * 12}px`, zIndex: 10 - index }}
                    >
                      <AvatarIcon
                        withHover={false}
                        user={{ fullName: user.fullName, avatar: user.avatar }}
                        className="w-6 h-6 border-2 border-white dark:border-gray-800"
                      />
                    </div>
                  ))}
                </div>

                {/* Typing animation */}
                <Typing />

                {/* "+N more typing..." */}
                {typingUsers.length > 2 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    +{typingUsers.length - 2} more typing...
                  </span>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachments and Uploading Attachment Dynamic UI*/}
          <div className="flex flex-col shrink-0 bg-customLightBg2 dark:bg-gray-900 min-h-0">
            {attachments.length > 0 && (
              <div className="attachments-preview flex flex-wrap gap-2 mt-2 px-4 shrink-0">
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
                          <span className="truncate max-w-[80%]">
                            {file.name}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() =>
                          setAttachments((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
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
              <div className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 shrink-0">
                Uploading files...
              </div>
            )}

            {/* Schedule meeting Options */}
            {showScheduleMeetingOptions && (
              <ScheduleMeetingOptions onSubmit={handleSendMeetingInvitation} onClose={() => setShowScheduleMeetingOptions(false)}/>
            )}
          </div>
        </div>

        {/* Bottom Input Bar UI */}
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
                    toast.error(
                      `${file.name} exceeds the ${maxSizeMB}MB limit and was skipped.`
                    );
                    continue;
                  }
                  validFiles.push(file);
                }

                setAttachments((prev) => {
                  const totalFiles = [...prev, ...validFiles];
                  if (totalFiles.length > maxFiles) {
                    toast.error(
                      `You can upload a maximum of ${maxFiles} files.`
                    );
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
            onChange={(e) => {
              handleTyping(e);
            }}
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
          <button
            onClick={handleSendMessage}
            className="send-btn p-2 rounded-full bg-green-500 hover:bg-green-400"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
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