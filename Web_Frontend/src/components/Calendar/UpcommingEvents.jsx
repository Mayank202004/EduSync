import { formatDate } from "@/utils/dateUtils";
import { useState, useEffect } from "react";

const SkeletonEvent = () => (
  <li className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-4 w-32 mb-2" />
    <Skeleton className="h-3 w-24" />
  </li>
);

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
);

const UpcomingEvents = ({ events, isLoading }) => {
  const today = new Date().toISOString().split("T")[0];

  const upcoming = events
    .filter((event) => event.start >= today)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 10);

  return (
    <div className="pr-2 max-h-[75vh] overflow-y-auto lg:pb-10">
      <h3 className="text-md xl:text-lg font-bold text-gray-700 dark:text-gray-200 ml-1 mb-2">
        Upcoming Events
      </h3>

      {/* Skeletons */}
      {isLoading && (
        <ul className="space-y-3 transition-opacity duration-500 opacity-100">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonEvent key={idx} />
          ))}
        </ul>
      )}

      {/* Data */}
      {!isLoading && (
        <>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No upcoming events found.
            </p>
          ) : (
            <ul className="space-y-3 transition-opacity duration-500 opacity-100">
              {upcoming.map((event, index) => (
                <li
                  key={index}
                  className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  style={{
                    backgroundColor: event.backgroundColor,
                    borderColor: event.borderColor,
                  }}
                >
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <p className="text-xs text-gray-700">
                    {event.start === event.end
                      ? `On: ${formatDate(event.start)}`
                      : `From: ${formatDate(event.start)} to ${formatDate(event.end)}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingEvents;
