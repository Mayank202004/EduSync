import { useState } from "react";
import FeeCard from "./FeeCard";
import FeeType from "./FeeType";
import { capitalizeFirstLetter } from "@/utils/textUtils";

const PendingFees = ({ isPending, feesData }) => {
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
      <h1 className="text-2xl font-bold m-3">Pending</h1>
      {isPending ? (
        <>
          {Object.entries(feesData).map(([type, fees]) =>
            fees.length === 0 ? undefined : (
              <FeeType key={type} type={`${capitalizeFirstLetter(type)} fees`}>
                {fees.map((element) => (
                  <FeeCard
                    key={element._id}
                    feeData={element}
                    selectedFees={selectedItems}
                    selectFee={selectFee}
                    deselectFee={deselectFee}
                  />
                ))}
              </FeeType>
            )
          )}
          <button
            type="button"
            disabled={selectedItems.length === 0}
            className="cursor-pointer block ml-auto mr-2 p-2 w-fit rounded-sm bg-green-400 text-black hover:not-disabled:bg-green-600 duration-200 disabled:opacity-50"
          >
            Proceed to pay
          </button>
        </>
      ) : (
        <p className="ml-4">
          You're all caught up! No pending fees at the moment.
        </p>
      )}
    </>
  );
};

export default PendingFees;
