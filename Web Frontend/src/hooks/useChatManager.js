import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

export const useChatManager = (chatId, initialMessages = []) => {
  const { socket, setUnseen } = useSocket();
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("joinChat", chatId);
    setUnseen((prev) => ({ ...prev, [chatId]: 0 }));

    const handleReceive = (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
        setUnseen((prev) => ({ ...prev, [chatId]: 0 }));
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage", handleReceive);
    };
  }, [socket, chatId]);

  return { messages, setMessages };
};
