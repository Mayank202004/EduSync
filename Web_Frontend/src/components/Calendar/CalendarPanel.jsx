import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@/context/AuthContext";
import AddEventModal from "./AddEventModal";
import { getEventColor } from "@/utils/calendarUtil";

const CalendarPanel = ({ events,setEvents, handleEventClick }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super admin";

  const [showModal, setShowModal] = useState(false);

  const handleAddEventClick = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleEventSubmit = (eventData) => {
    const { bg, border } = getEventColor(eventData.eventType);
    setEvents((prev) => [...prev, {...eventData, backgroundColor:bg, borderColor:border}]);
    setShowModal(false);
  };

  return (
    <div className="relative">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        height="auto"
        customButtons={{
          addEventButton: {
            text: "Add Event",
            click: handleAddEventClick,
          },
        }}
        headerToolbar={{
          start: "title",
          center: "",
          end: `${isSuperAdmin ? "addEventButton " : ""}today prev,next`,
        }}
      />
       {/* This section only applied to super admin */}
      {showModal && (
        <AddEventModal
          onClose={handleModalClose}
          onSubmit={handleEventSubmit}
        />
      )}
    </div>
  );
};

export default CalendarPanel;
