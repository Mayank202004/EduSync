/**
 * Formats raw calendar events for FullCalendar display.
 * @param {Array} rawEvents - Events fetched from the backend.
 * @returns {Array} formattedEvents
 */
export const formatEvents = (rawEvents) => {
  return rawEvents.map((event) => {
    const startDate = event.start.split("T")[0];
    let endDate = event.end ? event.end.split("T")[0] : startDate;

    // If start != end, add 1 day to endDate because FullCalendar treats end date as exclusive
    if (startDate !== endDate) {
      const adjustedEnd = new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000);
      endDate = adjustedEnd.toISOString().split("T")[0];
    }

    const { bg, border } = getEventColor(event.eventType);

    return {
      title: event.title,
      start: startDate,
      end: endDate,
      allDay: true,
      extendedProps: {
        description: event.extendedProps?.description,
        eventType: event.eventType,
      },
      backgroundColor: bg,
      borderColor: border,
    };
  });
};


/**
 * @desc - Return colour codes for different event types
 * @param {String} type - Event Type
 * @returns {Object} - Colour codes
 */
export const getEventColor = (type) => {
  switch (type?.toLowerCase()) {
    case "national holiday": return { bg: "#e0f2fe", border: "#3b82f6" };
    case "local holiday": return { bg: "#e0e7ff", border: "#6366f1" };
    case "academic event": return { bg: "#d1fae5", border: "#10b981" };
    case "exam": return { bg: "#fef3c7", border: "#f59e0b" };
    case "other": return { bg: "#fce7f3", border: "#db2777" };
    default: return { bg: "#f3f4f6", border: "#9ca3af" };
  }
};