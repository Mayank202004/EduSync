import { formatDate } from "@/utils/dateUtils";

const EventDetails = ({ event }) => {
  return (
    <div className="mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 min-h-[105px]">
      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Event Details</h3>
      {event ? (
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <p className="font-semibold">{event.title}</p>
          <p>
            {event.startStr === event.endStr || !event.endStr ? (
              <>On: {formatDate(event.startStr)}</>
            ) : (
              <>
                From: {formatDate(event.startStr)}
                <br />
                To: {formatDate(event.endStr)}
              </>
            )}
          </p>
          {event.extendedProps?.description && (
            <p className="mt-1 text-gray-500 dark:text-gray-400">{event.extendedProps.description}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Click an event to view details.</p>
      )}
    </div>
  );
};

export default EventDetails;
