import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Avatar from "../Avatar";

const ChatPanel = ({ messages, setMessages }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed) {
      setMessages((prev) => [
        ...prev,
        {
          _id: `${Date.now()}`,
          sender: "You",
          avatar: null,
          content: trimmed,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setInput("");
    }
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
        {/* Dummy div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="px-2 py-1 border rounded-4xl border-gray-300 flex gap-2 items-center">
        <input
          placeholder="Send a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-white border-none px-3 py-2 text-sm text-black placeholder-gray-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 hover:bg-gray-200 rounded-4xl flex items-center justify-center"
        >
          <Send size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
