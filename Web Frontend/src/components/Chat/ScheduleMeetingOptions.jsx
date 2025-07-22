import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatDateTime } from '@/utils/dateUtils';

function ScheduleMeetingOptions({ onSubmit, onClose }) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSendMeetingInvitation = (type, meetingTime = null) => {
    let messageContent = "";

    if (type === "now") {
      messageContent = "Join the meeting now.";
    } else if (type === "later" && meetingTime) {
      const formattedDateTime = formatDateTime(meetingTime)
      messageContent = `Meeting scheduled on ${formattedDateTime}.`;
    }
    onSubmit(type, messageContent); 
    onClose();
  };


  return (
    <div className="px-4 pt-2 pb-3 shrink-0">
      <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-lg border w-full">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-gray-800 dark:text-gray-200">Schedule a Meeting</p>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </button>
        </div>

        {!showScheduler ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSendMeetingInvitation("now")}
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded"
            >
              Start Instantly
            </button>
            <button
              onClick={() => setShowScheduler(true)}
              className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded w-full"
            >
              Schedule for Later
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="border rounded p-2 dark:bg-gray-700 dark:text-white text-black"
              min={new Date().toISOString().slice(0, 16)} // restrict to future time
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSendMeetingInvitation("later", scheduledTime)}
                disabled={!scheduledTime}
                className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
              >
                Schedule Meeting
              </button>
              <button
                onClick={() => setShowScheduler(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleMeetingOptions;
