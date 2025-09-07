import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import IconTextButton from "@/components/Chat/IconTextButton";
import { cn } from "@/lib/cn";

const ShowChatsButton = ({ onClick, isShown, unreadCount }) => {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 md:hidden transition-opacity duration-300",
        isShown ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <IconTextButton
        buttonProps={{ onClick }}
        icon={
          <div className="relative">
            <FontAwesomeIcon
              icon={faMessage}
              className="text-white size-6.5 text-2xl box-content p-1.5 translate-y-1"
            />

            {/* Unread Count Badge*/}
            {/* Unread Count Badge */}
{unreadCount > 0 && (
  <span
    className={cn(
      "absolute -top-1 -right-1 flex items-center justify-center",
      "h-5 w-5 rounded-full bg-red-600 text-white text-[10px] font-bold",
      "border-2 border-white shadow-md"
    )}
  >
    {unreadCount > 9 ? "9+" : unreadCount}
  </span>
)}

          </div>
        }
        className="bg-blue-600 hover:bg-blue-700 w-fit text-white rounded-md shadow-lg"
      />
    </div>
  );
};

export default ShowChatsButton;
