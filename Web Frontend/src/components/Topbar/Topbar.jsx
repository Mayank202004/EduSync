import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Topbar = () => {
  return (
    <div className='navbar'>
        {/* <img src="" alt="logo" /> */}
        <ul>
            <li>Home</li>
            <li>Fees</li>
            <li>Resources</li>
            <li>Calendar</li>
        </ul>
        <div className='search-box'>
            <input type="text" placeholder='Search'/>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
            
            
        </div>
        <img src="" alt="Theme Toggle" />
    </div>
  )
}

export default Topbar