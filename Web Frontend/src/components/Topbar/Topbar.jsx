import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import toggleLight from '../../assets/day.png'
import toggleDark from '../../assets/night.png'

const Topbar = ({theme,setTheme}) => {
    const handleToggleTheme = ()=>{
        theme === 'light' ? setTheme('dark') : setTheme('light');
    }

  return (
    <div className={`navbar w-screen flex justify-between items-center bg-white dark:bg-black duration-500 shadow-md px-4 py-2`}>
        {/* <img src="" alt="logo" /> */}
        <h1 className='Logo text-3xl font-bold'>EduSync</h1>
        <ul className='flex gap-8'>
            <li>Home</li>
            <li>Fees</li>
            <li>Resources</li>
            <li>Calendar</li>
        </ul>
        <div className={`search-box flex item-center px-4 py-2 rounded-full bg-black dark:bg-white shadow-md`}>
            <input type="text" placeholder='Search' className='outline-0 border-0 mr-1 dark:placeholder:text-black placeholder:text-white'/>
            <div className='search-icon flex items-center justify-center'>
            <FontAwesomeIcon icon={faMagnifyingGlass} className='dark:text-black text-white'/>
            </div>
            
            
        </div>
        <img onClick={()=>{handleToggleTheme()}} src={theme ==='light' ? toggleDark : toggleLight} alt="Theme Toggle" className='w-10 h-10'/>
    </div>
  )
}

export default Topbar