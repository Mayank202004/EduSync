import React, { useEffect, useState } from "react";
import { Inbox, Send, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchOpenTickets } from "@/services/dashboardService";

const TicketInbox = ({ onBackPressed }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const response = await fetchOpenTickets();
        setTickets(response.data || []);
      } catch (error) {
        // Handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleReply = () => {
    if (!reply.trim()) return toast.error("Reply cannot be empty.");
    toast.success("Reply sent (mock)");
    setReply("");
  };

  return (
    <div className="bg-white dark:bg-customDarkFg border p-6 rounded-xl shadow-sm text-gray-900 dark:text-white max-w-5xl mx-auto h-[calc(100%-30px)] my-5 w-full px-4 flex flex-col overflow-hidden">
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
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading...
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-center text-gray-500">
              No open tickets found.
            </p>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 mb-2 border-b-2 rounded cursor-pointer ${
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
                  <span>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
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
