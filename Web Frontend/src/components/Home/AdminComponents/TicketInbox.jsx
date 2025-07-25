import React, { useState } from "react";
import { Inbox, Send, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const openTickets = [
  {
    _id: "1",
    title: "Issue logging into portal",
    status: "open",
    category: "Login",
    priority: "high",
    createdAt: "2025-07-24T10:00:00Z",
    description: "I can't log in with my registered email. It says user not found.",
  },
  {
    _id: "2",
    title: "Incorrect grade shown for semester 6",
    status: "open",
    category: "Academics",
    priority: "medium",
    createdAt: "2025-07-22T13:45:00Z",
    description: "The grade displayed for DBMS is incorrect. Please verify.",
  },
  {
    _id: "3",
    title: "Unable to access uploaded lecture notes",
    status: "open",
    category: "Resources",
    priority: "low",
    createdAt: "2025-07-21T08:15:00Z",
    description: "Lecture notes are not opening or downloadable in the portal.",
  },
  {
    _id: "4",
    title: "Update phone number in student profile",
    status: "open",
    category: "Profile",
    priority: "low",
    createdAt: "2025-07-19T16:30:00Z",
    description: "Need to update my phone number but the option is disabled.",
  },
  {
    _id: "5",
    title: "Scholarship form submission failed",
    status: "open",
    category: "Finance",
    priority: "high",
    createdAt: "2025-07-18T11:20:00Z",
    description: "I'm unable to submit my scholarship form due to a server error.",
  },
];

const TicketInbox = ({ onBackPressed }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");

  const handleReply = () => {
    if (!reply.trim()) return toast.error("Reply cannot be empty.");
    toast.success("Reply sent (mock)");
    setReply("");
  };

  return (
    <div className="bg-white dark:bg-customDarkFg border p-6 rounded-xl shadow-sm text-gray-900 dark:text-white max-w-5xl mx-auto h-full flex flex-col overflow-hidden pb-4">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
        <Inbox className="w-6 h-6 text-blue-600" /> Support Tickets
      </h2>

      <button
        onClick={onBackPressed}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-6 flex-grow overflow-hidden">
        <div className="border rounded p-3 overflow-y-auto min-h-0">
          {openTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedTicket?._id === ticket._id
                  ? "bg-blue-100 dark:bg-blue-900/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <h4 className="font-semibold text-sm truncate">
                {ticket.title}
              </h4>
              <p className="text-xs text-gray-500">{ticket.category}</p>
              <div className="flex justify-between text-xs mt-1">
                <span className="capitalize">{ticket.priority} priority</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedTicket && (
          <div className="border rounded p-4 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedTicket.title}</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:underline"
              >
                <ArrowLeft size={16} /> Back
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow overflow-y-auto">
              {selectedTicket.description}
            </p>

            <div>
              <label className="text-sm font-medium block mb-1">
                Reply to Ticket
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="Type your reply here..."
                className="w-full p-2 border rounded dark:bg-customDarkFg"
              />
              <button
                onClick={handleReply}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Send size={16} /> Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketInbox;
