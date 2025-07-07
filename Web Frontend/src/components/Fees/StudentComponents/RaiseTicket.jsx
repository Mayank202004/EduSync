import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import SimpleButton from "@/components/Chat/SimpleButton";
import IconTextButton from "@/components/Chat/IconTextButton";
import { RaiseTicketModal } from "./RaiseTicketModal";
import { useState } from "react";

const RaiseTicket = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center max-w-[80%] w-full rounded-md p-4 mx-auto bg-amber-100">
      <h1 className="font-bold text-xl dark:text-black">Any Issues?</h1>
      <p className="leading-4.5 my-1 dark:text-black">
        Please let us know by raising a ticket
      </p>
      <IconTextButton
        predefinedColor="custom"
        buttonProps={{onClick: () => setIsModalOpen(true)}}
        text="Raise Ticket"
        icon={<FontAwesomeIcon icon={faTicket} className="mt-0.5" />}
        className="w-[90%] font-bold mt-4 self-center bg-amber-500 p-1.5 hover:bg-amber-600 dark:hover:bg-amber-600 duration-200"
      />
      {isModalOpen && <RaiseTicketModal closeModalCallback={() => setIsModalOpen(false)}/>}
    </div>
  );
};

export default RaiseTicket;
