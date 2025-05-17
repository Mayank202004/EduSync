import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";

const RaiseTicket = () => {
  return (
    <div className="max-w-[80%] rounded-md p-3 mx-auto bg-amber-100">
      <h1 className="font-bold text-xl dark:text-black">Any Issues?</h1>
			<p className="leading-4.5 my-1 dark:text-black">Please let us know by raising a ticket</p>
			<button type="button" className="flex gap-1 items-center justify-center w-[90%] font-bold cursor-pointer mx-auto mt-4 bg-amber-500 p-1.5 rounded-sm hover:bg-amber-600 duration-200">
				<FontAwesomeIcon icon={faTicket} className="mt-0.5"/>
				<span>Raise Ticket</span>
				</button>
    </div>
  );
};

export default RaiseTicket;
