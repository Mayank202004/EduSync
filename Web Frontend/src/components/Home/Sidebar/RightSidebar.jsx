import ExpandableItem from "../../Chat/ExpandableItem";
import ExpandableItemChild from "./ExpandableItemChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import UpcomingEvents from "@/components/Calendar/UpcommingEvents";


const RightSidebar = ({events}) => {
  console.log(events)
  return (
    <div className="max-w-[85%] p-5 text-sm my-5 mx-auto bg-white dark:bg-customDarkFg rounded-md overflow-y-auto">
      <div className="flex items-center justify-around align-middle mb-3 ">
        <FontAwesomeIcon
          icon={faCalendar}
          className="dark:text-white text-black text-2xl"
        />
        <h2 className="font-semibold text-1.5xl">Upcoming Events</h2>
      </div>

      <UpcomingEvents events={events} isLoading={false}/>
      <button className="px-5 text-blue-500 hover:text-blue-300 duration-500">
        View Calendar
      </button>
    </div>
  );
};

export default RightSidebar;
