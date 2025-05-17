import { useState } from "react";
import FeeCard from "../components/Fees/FeeCard";
import PaymentFAQs from "@/components/Fees/FAQs";
import RaiseTicket from "@/components/Fees/RaiseTicket";

const feesData = [
  {
    id: 1,
    title: "Tuition Feeee",
    amount: 20000,
    dueDate: "2025-06-15",
    status: "unpaid",
  },
  {
    id: 2,
    title: "Library Fee",
    amount: 1500,
    dueDate: "2025-06-10",
    status: "unpaid",
  },
  {
    id: 3,
    title: "Lab Fee",
    amount: 3000,
    dueDate: "2025-06-20",
    status: "paid",
  },
  {
    id: 4,
    title: "Sports Fee",
    amount: 1000,
    dueDate: "2025-06-25",
    status: "unpaid",
  },
  {
    id: 5,
    title: "Exam Fee",
    amount: 2500,
    dueDate: "2025-07-01",
    status: "unpaid",
  },
];

const Fees = () => {
  const [selectedItems, setSelectedItems] = useState([]); //store ids of selected items

  function selectFee(id) {
    console.log("pressed");
    setSelectedItems((prevSelectedItems) => [...prevSelectedItems, id]);
  }

  function deselectFee(id) {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item !== id)
    );
  }

  return (
    <>
      <div className="md:flex md:h-screen">
        <div className="md:w-3/10 md:border-r-1 h-full">
          <h1 className="font-bold text-3xl mt-4 w-fit mx-auto md:my-10">
            Fees
          </h1>
        </div>
        <div className="p-4 md:mr-0 w-full">
          <h1 className="text-2xl font-bold m-3">Dues</h1>
          <ul className="py-2 mx-auto">
            {feesData.map(
              (element, index) =>
                element.status === "unpaid" && (
                  <FeeCard
                    key={index}
                    feeData={element}
                    selectedFees={selectedItems}
                    selectFee={selectFee}
                    deselectFee={deselectFee}
                  />
                )
            )}
          </ul>
          <button
            type="button"
            disabled={selectedItems.length === 0}
            className="cursor-pointer block ml-auto mr-2 p-2 w-fit rounded-sm bg-green-400 text-black hover:not-disabled:bg-green-600 duration-200 disabled:opacity-50"
          >
            Proceed to pay
          </button>
        </div>
        <div className="md:w-1/2 border-l-1 h-full">
            <PaymentFAQs />
            <RaiseTicket />
        </div>
      </div>
    </>
  );
};

export default Fees;
