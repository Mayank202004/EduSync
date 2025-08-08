import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import IconTextButton from "@/components/Chat/IconTextButton";
import { cn } from "@/lib/cn";

const ShowChatsButton = ({ onClick, isShown }) => {
  return (
    <IconTextButton
      buttonProps={{ onClick: onClick }}
      icon={
        <FontAwesomeIcon
          icon={faMessage}
          className="text-white size-6.5 text-2xl box-content p-1.5 translate-y-1"
        />
      }
      className={cn(
        "fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 w-fit text-white container rounded-md shadow-lg md:hidden transition-opacity duration-300",
        isShown ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    />
  );
};

export default ShowChatsButton;
