// NotificationDropdown.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

const notifications = [
  { id: 1, message: "You have 1 tasks due today" },
  { id: 2, message: "You have 3 tasks due today" },
  { id: 3, message: "You have 2 tasks due today" },
  { id: 4, message: "You have 2 tasks due today" },
];

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <FontAwesomeIcon
            icon={faMessage}
            className="text-black dark:text-white text-2xl"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b text-sm font-semibold text-gray-700 dark:text-gray-200">
            Notifications
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-indigo-500 text-xl mt-1"
                />
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {n.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
