import React, { useState } from "react";
import { useEffect } from "react";
import Topbar from "./components/Topbar/Topbar";
import { Outlet } from "react-router-dom";

const App = () => {
  // Get stored theme from local storage
  const currentTheme = localStorage.getItem("currentTheme");

  // Set initial theme based on stored value or default to light
  /**
   * @desc Hook for current theme
   */
  const [theme, setTheme] = useState(currentTheme ?? "Light");

  /**
   * @desc: This hook is invoked when theme chnages
   */
  useEffect(() => {
    // Toggle class of html ("" or "dark") based on current theme. (Used for global dark mode inheriting)
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Store the current theme in local storage
    localStorage.setItem("currentTheme", theme);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-full w-full">
      <Topbar theme={theme} setTheme={setTheme} />
      <div className="relative grow flex h-full w-full transition-colors duration-500 bg-customLightBg text-black dark:bg-customDarkBg dark:text-white">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
