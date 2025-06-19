// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [unseen, setUnseen] = useState({}); // { chatId: count }

  useEffect(() => {
    if (!user) return;

    const socketConnection = io("https://yourserver.com", {
      auth: { token: user.token },
    });

    socketConnection.on("connect", () => {
      console.log("Connected to socket");
      socketConnection.emit("joinUser", user._id); // optional
    });

    socketConnection.on("notifyNewMessage", ({ chatId, from, preview }) => {
      setUnseen((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, unseen, setUnseen }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
