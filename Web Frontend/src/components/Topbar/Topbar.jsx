import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import toggleLight from '../../assets/day.png';
import toggleDark from '../../assets/night.png';
import { faCircleQuestion, faMessage } from '@fortawesome/free-regular-svg-icons';

const Topbar = ({ theme, setTheme }) => {
  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  /**
   * @desc Function to determine the class for navigation links
   */
  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition-colors duration-300 ${
      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-black dark:text-white'
    } hover:text-blue-500 dark:hover:text-blue-300`;

  return (
    <header className={`navbar w-full flex items-center bg-white dark:bg-black shadow-md px-4 py-3 duration-500`}>
      <h1 className='Logo text-3xl font-bold text-black dark:text-white'>EduSync</h1>

      <nav className='mx-auto'>
        <ul className='flex gap-8'>
          <li>
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/fees" className={navLinkClass}>Fees</NavLink>
          </li>
          <li>
            <NavLink to="/resources" className={navLinkClass}>Resources</NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink>
          </li>
        </ul>
      </nav>

      <div className={`search-box flex self-end items-center px-4 py-2 mx-4 rounded-full bg-black dark:bg-white shadow-md`}>
        <input
          type="text"
          placeholder="Search"
          className="outline-none border-0 mr-2 bg-transparent dark:placeholder:text-black placeholder:text-white text-white dark:text-black"
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className="dark:text-black text-white" />
      </div>

      <div className='flex items-center'>
        <FontAwesomeIcon icon={faMessage} className="text-black dark:text-white text-2xl" />
        <FontAwesomeIcon icon={faCircleQuestion} className="text-black dark:text-white text-2xl ml-5" />

        <button onClick={handleToggleTheme} aria-label="Toggle Theme">
          <img
            src={theme === 'light' ? toggleDark : toggleLight}
            alt="Theme Toggle"
            className="w-8 h-8 ml-4 cursor-pointer select-none"
            draggable="false"
            />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
