// AcademicCalendar.jsx
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for dateClick

const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      title: "Session Break",
      start: "2025-03-22",
      end: "2025-04-03",
      extendedProps: {
        description: "End-of-session break",
      },
      backgroundColor: "#d1fae5",
      borderColor: "#10b981",
    },
    {
      title: "Yearly Exam Std. III to VIII",
      start: "2025-03-10",
      end: "2025-03-22",
      backgroundColor: "#e0e7ff",
      borderColor: "#6366f1",
    },
    {
      title: "Final Exam Std. IX",
      start: "2025-03-11",
      end: "2025-03-22",
      backgroundColor: "#fce7f3",
      borderColor: "#db2777",
    },
    {
      title: "Mahashivratri",
      start: "2025-03-26",
      backgroundColor: "#fef3c7",
      borderColor: "#f59e0b",
    },
    {
      title: "Holi",
      start: "2025-03-20",
      backgroundColor: "#e0f2fe",
      borderColor: "#3b82f6",
    },
  ];

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1 bg-white dark:bg-customDarkFg shadow dark:shadow-md rounded-lg p-4 ml-5">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Academic Calendar - March 2025
        </h2>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2025-03-01"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={{
            start: "title",
            center: "",
            end: "today prev,next",
          }}
        />
      </div>

      <div className="w-full md:w-80 bg-white dark:bg-customDarkFg border-l  p-4 rounded-lg">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Event Details</h3>
        {selectedEvent ? (
          <div className="mt-2">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedEvent.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              From: {selectedEvent.startStr}
              <br />
              To: {selectedEvent.endStr || selectedEvent.startStr}
            </p>
            {selectedEvent.extendedProps?.description && (
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                {selectedEvent.extendedProps.description}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Click an event to view details.</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
