import { useEffect, useState } from "react";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils";
import NavLinks from "./NavLinks";
import {
  SearchBar,
  Message,
  Question,
  ToggleTheme,
  Avatar,
} from "./NavbarButtons";

const ResponsiveTopBar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  //prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.overscrollBehavior = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.overscrollBehavior = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <header className="navbar w-full flex items-center bg-white dark:bg-black shadow-md px-4 py-3 max-h-15 duration-500">
        <h1 className="Logo text-3xl font-bold text-black dark:text-white">
          EduSync
        </h1>
        <div className="tablet:hidden ml-auto flex items-center gap-2 sm:gap-3">
          <Avatar />
          <button
            className="tablet:hidden size-fit p-2 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={isOpen ? faXmark : faBars}
              className="fa-xl"
            />
          </button>
        </div>
        <nav className="hidden tablet:flex w-full items-center">
          <ul className="flex gap-8 w-fit text-lg mx-auto font-bold">
            <NavLinks closeMenuCallback={() => setIsOpen(false)} />
          </ul>

          <SearchBar />
          <div className="flex items-center gap-3">
            <Message />
            <ToggleTheme theme={theme} setTheme={setTheme} />
            <Avatar />
          </div>
        </nav>
      </header>
      <div
        className={cn(
          "fixed tablet:hidden inset-0 top-15 z-20 bg-transparent w-full h-full",
          { "-z-999": !isOpen }
        )}
      >
        <nav className="ml-auto w-full sm:w-max h-full flex">
          {isOpen && (
            <div
              className="absolute inset-0 bg-gray-800 opacity-90 -z-1 duration-300"
              onClick={() => setIsOpen(false)}
            ></div>
          )}
          <ul
            className={cn(
              "flex flex-col gap-8 py-8 items-center sm:items-start sm:px-15 w-full text-xl font-bold bg-customLightBg dark:bg-customDarkBg h-full transform transition-transform duration-300",
              {
                "translate-x-0": isOpen,
                "translate-x-full": !isOpen,
              }
            )}
          >
            <NavLinks closeMenuCallback={() => setIsOpen(false)} />
            <SearchBar />

            <div className="flex items-center mx-auto gap-3">
              <Message />
              <ToggleTheme theme={theme} setTheme={setTheme} />
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ResponsiveTopBar;
