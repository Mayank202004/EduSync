import React, { useState } from 'react'
import { useEffect } from 'react'
import Topbar from './components/Topbar/Topbar'

const App = () => {

  const [theme,setTheme] = useState('dark')

  /**
   * @desc: THis hook is ued to set the theme to add (toggles class='' and class='dark' to html tag based on theme value above)
   */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden transition-colors duration-500 bg-white text-black dark:bg-gray-800 dark:text-white">
      <Topbar theme={theme} setTheme={setTheme} />
</main>

  )
}

export default App