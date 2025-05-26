import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  //event listener to close container if clicked outside the container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // for mobile

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const logoutUser = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const editProfile = () => {
    setIsOpen(false);
    navigate("user/edit")
  }

  return (
    <div ref={containerRef}>
      <AvatarIcon user={user} callback={() => setIsOpen((prev) => !prev)} />
      {isOpen && (
        <div className="absolute right-2 mt-4 w-max bg-customLightBg dark:bg-customDarkBg py-5 px-10 rounded-sm ring-1 ring-gray-500 z-10 flex flex-col gap-3">
          <button
            type="button"
            className="absolute top-4 right-4 hover:bg-gray-300 dark:hover:bg-gray-700 size-8 rounded-full cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="fa-lg" />
          </button>
          <div className="flex flex-col place-items-center">
            <AvatarIcon size={"medium"} withHover={false} user={user} />
            <h1 className="font-bold text-xl mt-2">{user.fullName}</h1>
            <button type="button" className="cursor-pointer space-x-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={editProfile}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Edit Profile</span>
            </button>
          </div>
          <hr />
          <button
            type="button"
            onClick={logoutUser}
            className="flex gap-2 mx-auto py-1 px-2 w-fit rounded-sm items-center justify-center cursor-pointer text-red-400 dark:text-red-400  hover:bg-gray-300/50 hover:dark:bg-gray-700/50"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
