import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import IconTextButton from "@/components/Chat/IconTextButton";
import useClickOutside from "@/hooks/useClickOutside";

import { cn } from "@/lib/cn";

const notifications = [
  { id: 1, message: "You have 1 tasks due today" },
  { id: 2, message: "You have 3 tasks due today" },
  { id: 3, message: "You have 2 tasks due today" },
  { id: 4, message: "You have 2 tasks due today" },
];

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [containerRef, ignoreContainerRef] = useClickOutside(() => setIsOpen(false));

  return (
    <div className="block md:hidden sm:relative">
      <IconTextButton
        ref={ignoreContainerRef}
        buttonProps={{ onClick: () => setIsOpen(prev => !prev) }}
        icon={
          <FontAwesomeIcon
            icon={faMessage}
            className="text-black dark:text-white size-6.5 text-2xl box-content p-1.5 translate-y-1"
          />
        }
        className="container rounded-full p-0"
      />

      <div
        ref={containerRef}
        className={cn(
          "absolute right-2 mt-3 w-80 sm:right-0 sm:mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 transition-tranform duration-100 origin-top-right",
          isOpen ? "scale-100" : "scale-0"
        )}
      >
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
    </div>
  );
};

export default NotificationDropdown;
