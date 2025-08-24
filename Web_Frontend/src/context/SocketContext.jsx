// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState, useRef} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [globalOnlineUsers, setGlobalOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const activeChatId = useRef(null);

  /**
   * @desc Sets the active chat
   * @param {String} chatId 
   */
  const setActiveChat = (chatId) => {
    activeChatId.current = chatId;
  };

  useEffect(() => {
    if (!user) return;

    const socketConnection = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        token: user.token, 
      },
      query: {
        className: user.className || null,
        div: user.div || null,
      },
    });

    const handleNewMessage = ({ chatId, from, preview }) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    };

    const handleConnect = () => {
      //console.log("✅ Socket connected:", socketConnection.id);
    };

    const handleConnectError = (err) => {
      console.error("❌ Socket connect error:", err.message);
    };

    socketConnection.on("connect", handleConnect);
    socketConnection.on("connect_error", handleConnectError);

    setSocket(socketConnection);

    return () => {
      //  Clean up listeners
      socketConnection.off("connect", handleConnect);
      socketConnection.off("connect_error", handleConnectError);

      //  Disconnect
      socketConnection.disconnect();
    };
  }, [user]);


// Handle online user list
  useEffect(() => {
    if (!socket) return;

    socket.on("currentOnlineUsers", (ids) => {
      setGlobalOnlineUsers(ids);
    });

    socket.on("userConnected", (id) => {
      setGlobalOnlineUsers((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      );
    });

    socket.on("userDisconnected", (id) => {
      setGlobalOnlineUsers((prev) => prev.filter((uid) => uid !== id));
    });

    return () => {
      socket.off("currentOnlineUsers");
      socket.off("userConnected");
      socket.off("userDisconnected");
    };
  }, [socket]);


  // Handle incoming messages globally
  useEffect(() => {
    if (!socket) return;

    const handleNotify = ({ chatId, from, preview }) => {
      if (from._id === user?._id) return; // Don't update for your own messages

      if (activeChatId.current !== chatId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1,
        }));
      } else {
        // Chat is currently open → reset unread count in backend
        socket.emit("chatRead", {
          chatId,
          userId: user._id,
        });
      }
    };

    socket.on("notifyNewMessage", handleNotify);
    return () => socket.off("notifyNewMessage", handleNotify);
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket, activeChatId, setActiveChat, globalOnlineUsers,unreadCounts,setUnreadCounts}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
