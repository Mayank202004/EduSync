import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  faCircleQuestion,
  faMessage,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/auth/AuthContext";
import toggleLight from "../../assets/day.png";
import toggleDark from "../../assets/night.png";
import AvatarIcon from "./AvatarIcon";

export const SearchBar = () => {
  return (
    <div className="tablet:mx-4 w-fit search-box flex items-center px-4 py-2 rounded-full bg-black dark:bg-white shadow-md">
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

export const Message = () => {
  return (
    <FontAwesomeIcon
      icon={faMessage}
      className="text-black dark:text-white text-2xl"
    />
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

export const ToggleTheme = ({ theme, setTheme }) => {
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={handleToggleTheme} aria-label="Toggle Theme">
      <img
        src={theme === "light" ? toggleDark : toggleLight}
        alt="Theme Toggle"
        className="w-8 h-8 cursor-pointer select-none"
        draggable="false"
      />
    </button>
  );
};

export const Avatar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      tabIndex={0} // makes div focusable
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <AvatarIcon user={user}/>
      {isOpen && (
        <div className="absolute right-2 mt-4 w-max bg-customLightBg dark:bg-customDarkBg py-5 px-10 rounded-sm ring-1 ring-gray-500 z-10 flex flex-col gap-3">
          <button type="button" className="absolute top-4 right-4 hover:bg-gray-300 dark:hover:bg-gray-700 size-8 rounded-full cursor-pointer" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faXmark} className="fa-lg"/>
          </button>
          <div className="flex flex-col place-items-center">
            <AvatarIcon size={"medium"} withHover={false} user={user}/>
            <h1 className="font-bold text-xl mt-2">{user.fullName}</h1>
            <Link className="space-x-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Edit Profile</span>
            </Link>
          </div>
          <hr />
          <button className="flex gap-2 items-center justify-center text-red-400 dark:text-red-400">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
