import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@/auth/AuthContext";
import AddEventModal from "./AddEventModal";

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
    setEvents((prev) => [...prev, eventData]);
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
