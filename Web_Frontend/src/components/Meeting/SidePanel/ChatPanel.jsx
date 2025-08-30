import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Avatar from "../Avatar";
import { useSocket } from "@/context/SocketContext";

const ChatPanel = ({ messages, setMessages, CurrentUser, roomId, isHost, hostControls }) => {
  const { socket } = useSocket();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const canSend = isHost || hostControls?.chatAllowed;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !canSend) return;

    const newMsg = {
      _id: `${Date.now()}`,
      sender: CurrentUser?.fullName ?? "Anonymous",
      avatar: CurrentUser?.avatar,
      content: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    socket.emit("meeting-message", {
      roomId,
      message: newMsg
    });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white text-black">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="flex items-start gap-3 text-sm">
            <Avatar name={msg.sender} avatar={msg.avatar} size={10} />
            <div>
              <div className="font-semibold text-blue-600">{msg.sender}</div>
              <div className="text-gray-800">{msg.content}</div>
              <div className="text-xs text-gray-500">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div
        className={`px-2 py-1 border rounded-4xl flex gap-2 items-center ${
          canSend ? "border-gray-300" : "border-gray-200 bg-gray-100 opacity-70"
        }`}
      >
        <input
          placeholder={canSend ? "Send a message" : "Chat disabled by host"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!canSend}
          className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-black placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`px-3 py-2 rounded-4xl flex items-center justify-center ${
            canSend
              ? "hover:bg-gray-200"
              : "cursor-not-allowed text-gray-400"
          }`}
        >
          <Send size={16} className={canSend ? "text-gray-600" : "text-gray-400"} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
