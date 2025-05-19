import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarPanel = ({ events, handleEventClick }) => {
  return (
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
  );
};

export default CalendarPanel;
