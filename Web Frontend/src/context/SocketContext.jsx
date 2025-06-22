// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unseen, setUnseen] = useState({}); // { chatId: count }
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

    socketConnection.on("connect", () => {
      console.log("✅ Socket connected:", socketConnection.id);
    });


    socketConnection.on("notifyNewMessage", ({ chatId, from, preview }) => {
      setUnseen((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    });

    socketConnection.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });
    

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, unseen, setUnseen, setActiveChat}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
