import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faCircleQuestion,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import toggleLight from "../../assets/day.png";
import toggleDark from "../../assets/night.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      className="text-black dark:text-white text-2xl ml-5"
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
        className="w-8 h-8 ml-4 cursor-pointer select-none"
        draggable="false"
      />
    </button>
  );
};
