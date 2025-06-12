import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarIcon from "@/components/ui/AvatarIcon";
import IconTextButton from "@/components/ui/IconTextButton";
import NotificationDropdown from "./NotificationDropdown";

export const SearchBar = () => {
  return (
    <div className="tablet:mx-4 w-fit search-box flex font-medium items-center px-4 py-2 rounded-full bg-black dark:bg-white shadow-md">
      <input
        type="text"
        placeholder="Search"
        className="outline-none border-0 mr-2 bg-transparent dark:placeholder:text-black placeholder:text-white text-white dark:text-black"
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="dark:text-black text-white"
      />
    </div>
  );
};

export const Question = () => {
  return (
    <FontAwesomeIcon
      icon={faCircleQuestion}
      className="text-black dark:text-white text-2xl"
    />
  );
};

