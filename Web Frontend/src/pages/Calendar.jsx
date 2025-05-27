import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCalendarEvents } from "@/services/calendarService.js";
import CalendarPanel from "@/components/Calendar/CalendarPanel";
import EventDetails from "@/components/Calendar/EventDetails";
import UpcomingEvents from "@/components/Calendar/UpcommingEvents";
import Legend from "@/components/Calendar/Legend";
import LoadingScreen from "@/components/Loading";

/**
 * @desc Return colour codes for different event types
 */
const getEventColor = (type) => {
  switch (type?.toLowerCase()) {
    case "national holiday": return { bg: "#e0f2fe", border: "#3b82f6" };
    case "local holiday": return { bg: "#e0e7ff", border: "#6366f1" };
    case "academic event": return { bg: "#d1fae5", border: "#10b981" };
    case "exam": return { bg: "#fef3c7", border: "#f59e0b" };
    case "other": return { bg: "#fce7f3", border: "#db2777" };
    default: return { bg: "#f3f4f6", border: "#9ca3af" };
  }
};

const CalendarPage = () => {
//Hooks
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCalendarEvents();
        const rawEvents = response.data;

        const formattedEvents = rawEvents.map((event) => {
          const startDate = event.start.split("T")[0];
          let endDate = event.end ? event.end.split("T")[0] : startDate;
                
          // If start != end, add 1 day to endDate for FullCalendar display (Because end date is exclusive)
          if (startDate !== endDate) {
            const adjustedEnd = new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000);
            endDate = adjustedEnd.toISOString().split("T")[0];
          }
        
          return {
            title: event.title,
            start: startDate,
            end: endDate,
            allDay: true,
            extendedProps: {
              description: event.extendedProps?.description,
              eventType: event.eventType,
            },
            backgroundColor: getEventColor(event.eventType).bg,
            borderColor: getEventColor(event.eventType).border,
          };
        });

        setEvents(formattedEvents);
      } catch {
        toast.error("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const legend = [
    { label: "National Holiday", color: getEventColor("national holiday") },
    { label: "Local Holiday", color: getEventColor("local holiday") },
    { label: "Academic Event", color: getEventColor("academic event") },
    { label: "Exam", color: getEventColor("exam") },
    { label: "Other", color: getEventColor("other") },
  ];

  return (
    <div className="flex grow flex-col md:flex-row gap-4 p-4">
      {/* Calendar View */}
      <div className="flex-1 bg-white dark:bg-customDarkFg shadow dark:shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Academic Calendar - March 2025
        </h2>
        {isLoading ? (
          <LoadingScreen/>
        ) : (
          <>
            <CalendarPanel events={events} setEvents={setEvents} handleEventClick={(info) => setSelectedEvent(info.event)} />
            <Legend legend={legend} />
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-customDarkFg border-l rounded-lg p-4 flex flex-col h-full">
        <EventDetails event={selectedEvent} formatDate={formatDate} />
        <UpcomingEvents events={events} isLoading={isLoading} formatDate={formatDate} />
      </div>
    </div>
  );
};

export default CalendarPage;
