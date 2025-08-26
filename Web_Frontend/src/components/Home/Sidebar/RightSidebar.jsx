import ExpandableItem from "../../Chat/ExpandableItem";
import ExpandableItemChild from "./ExpandableItemChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import UpcomingEvents from "@/components/Calendar/UpcommingEvents";
import { useNavigate } from "react-router-dom";


const RightSidebar = ({events}) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-[85%] px-3 py-5 xl:p-5 text-sm my-5 mx-auto bg-white dark:bg-customDarkFg rounded-md h-full flex flex-col">
      <div className="flex items-center gap-2 justify-center align-middle mb-3 ">
        <FontAwesomeIcon
          icon={faCalendar}
          className="dark:text-white text-black text-2xl"
        />
        <h2 className="font-semibold text-1.5xl">Events</h2>
      </div>
      <div className="">
        <UpcomingEvents events={events} isLoading={false}/>
      </div>

      <button 
        className="px-5 mt-3 text-blue-500 hover:text-blue-300 duration-500"
        onClick={() => navigate('/calendar')}
      >
          View Calendar
      </button>
    </div>
  );
};

export default RightSidebar;
