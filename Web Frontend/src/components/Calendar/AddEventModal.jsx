import React, { useState } from "react";
import toast from "react-hot-toast";
import { addCalendarEvent } from "@/services/calendarService";

const AddEventModal = ({ onClose, onSubmit }) => {
    // Hooks
    const [isSingleDay, setIsSingleDay] = useState(true);
    const [eventType, setEventType] = useState("event");

    /**
     * @desc Event handler for form submission
     */
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get("title");
      const isSingle = isSingleDay;
      const eventType = formData.get("eventType");

      let eventData = {
        title,
        eventType,
      };

      if (isSingle) {
        const date = formData.get("date");
        eventData.start = date;
        eventData.end = date;
      } else {
        eventData.start = formData.get("startDate");
        eventData.end = formData.get("endDate");
        eventData.endDescription = formData.get("endDateDescription");
      }
      await toast.promise(
        addCalendarEvent(eventData),
        {
          loading: "Adding event...",
          success: "Event added successfully!",
          error: "Failed to add event.",
        }
      );
      onSubmit(eventData);
    };


  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add New Event</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            required
            type="text"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Is Single Day Event */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isSingleDay}
              onChange={(e) => setIsSingleDay(e.target.checked)}
              className="mr-2"
            />
            Is Single-Day Event
          </label>
        </div>

        {/* Conditional Date Fields */}
        {isSingleDay ? (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Date</label>
            <input
              name="date"
              required
              type="date"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                name="startDate"
                required
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">End Date</label>
              <input
                name="endDate"
                required
                type="date"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">End Date Description</label>
              <input
                name="endDateDescription"
                type="text"
                placeholder="e.g., Exam Ends"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </>
        )}

        {/* Event Type Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Event Type</label>
          <select
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 
               px-3 py-2 rounded 
               bg-white text-black 
               dark:bg-customDarkFg dark:text-white 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="national holiday">National Holiday</option>
            <option value="local holiday">Local Holiday</option>
            <option value="event">Event</option>
            <option value="academic event">Academic Event</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventModal;
