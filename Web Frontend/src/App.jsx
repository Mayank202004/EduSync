import React, { useState } from 'react'
import { useEffect } from 'react'
import Topbar from './components/Topbar/Topbar'
import { Outlet } from 'react-router-dom'

const App = () => {

  // Get stored theme from local storage
  const currentTheme = localStorage.getItem('currentTheme')
  
  // Set initial theme based on stored value or default to light
  /**
   * @desc Hook for current theme
   */
  const [theme,setTheme] = useState(currentTheme ?? 'Light')

  /**
   * @desc: This hook is invoked when theme chnages
  */
  useEffect(() => {
    // Toggle class of html ("" or "dark") based on current theme. (Used for global dark mode inheriting)
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Store the current theme in local storage
    localStorage.setItem('currentTheme',theme);
  }, [theme]);
  
  return (
    <>
      <Topbar theme={theme} setTheme={setTheme}/>
      <div className="relative min-h-screen w-screen overflow-x-hidden transition-colors duration-500 bg-customLightBg text-black dark:bg-customDarkBg dark:text-white">
        <Outlet />
      </div>
    </>
  )
}

export default App