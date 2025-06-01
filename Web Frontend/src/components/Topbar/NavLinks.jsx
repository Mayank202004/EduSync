import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const NavLinks = ({ closeMenuCallback }) => {
  const { user } = useAuth(); 
  const role = user?.role;
  /**
   * @desc Function to determine the class for navigation links
   */
  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition-colors duration-300 ${
      isActive
        ? "text-blue-600 dark:text-blue-400 after:content-[''] after:block after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-1 after:bg-blue-400 after:rounded-full"
        : "text-black dark:text-white"
    } hover:text-blue-500 dark:hover:text-blue-300`;

  return (
    <>
      <li>
        <NavLink to="/" className={navLinkClass} onClick={closeMenuCallback}>
          Home
        </NavLink>
      </li>
      {(role === 'student' || role === 'super admin') && (
      <li>
        <NavLink
          to="/fees"
          className={navLinkClass}
          onClick={closeMenuCallback}
        >
          Fees
        </NavLink>
      </li>
      )}
      {(role === 'teacher') && (
        <NavLink
          to="/attendance"
          className={navLinkClass}
          onClick={closeMenuCallback}
        >
          Attendance
        </NavLink>
      )}
      <li>
        <NavLink
          to="/resources"
          className={navLinkClass}
          onClick={closeMenuCallback}
        >
          Resources
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/calendar"
          className={navLinkClass}
          onClick={closeMenuCallback}
        >
          Calendar
        </NavLink>
      </li>
    </>
  );
};

export default NavLinks;
