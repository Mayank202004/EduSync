import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import IconTextButton from "@/components/Chat/IconTextButton";


const NotificationDropdown = () => {
  return (
      <IconTextButton
        buttonProps={{ onClick: () => {} }}
        icon={
          <FontAwesomeIcon
            icon={faMessage}
            className="text-black dark:text-white size-6.5 text-2xl box-content p-1.5 translate-y-1"
          />
        }
        className="block md:hidden sm:relative container rounded-full p-0"
      />
  );
};

export default NotificationDropdown;
