import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCalendarEvents } from "@/services/calendarService.js";
import CalendarPanel from "@/components/Calendar/CalendarPanel";
import EventDetails from "@/components/Calendar/EventDetails";
import UpcomingEvents from "@/components/Calendar/UpcommingEvents";
import Legend from "@/components/Calendar/Legend";
import LoadingScreen from "@/components/Loading";
import { formatEvents } from "@/utils/calendarUtil";
import { getEventColor } from "@/utils/calendarUtil";


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

        const formattedEvents = formatEvents(rawEvents);
        setEvents(formattedEvents);
      } catch {
        toast.error("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const legend = [
    { label: "National Holiday", color: getEventColor("national holiday") },
    { label: "Local Holiday", color: getEventColor("local holiday") },
    { label: "Academic Event", color: getEventColor("academic event") },
    { label: "Exam", color: getEventColor("exam") },
    { label: "Other", color: getEventColor("other") },
  ];

  return (
    <div className="flex grow flex-col md:flex-row gap-4 px-4 pt-4 h-[90vh] overflow-auto md:overflow-hidden">
      {/* Calendar View */}
      <div className="flex-1 bg-white dark:bg-customDarkFg shadow dark:shadow-md rounded-lg p-4 md:h-full lg:overflow-y-auto">
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
       <div className="w-full md:w-80 bg-white dark:bg-customDarkFg border-l rounded-lg p-4 flex flex-col md:h-full">
      <EventDetails event={selectedEvent} />
      <UpcomingEvents events={events} isLoading={isLoading} />
    </div>
    </div>
  );
};

export default CalendarPage;
