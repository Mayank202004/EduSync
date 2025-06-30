import { useState } from "react";
import FeeCard from "./FeeCard";
import FeeType from "./FeeType";
import SimpleButton from "@/components/ui/SimpleButton";
import { capitalizeFirstLetter } from "@/utils/textUtils";

const PendingFees = ({ isPending, feesData }) => {
  const [selectedItems, setSelectedItems] = useState([]); //store ids of selected items

  const selectFee = (id) => {
    setSelectedItems((prevSelectedItems) => [...prevSelectedItems, id]);
  };

  const deselectFee = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item !== id)
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold m-3">Pending</h1>
      {isPending ? (
        <>
          {Object.entries(feesData).map(
            ([type, fees]) =>
              fees.length !== 0 && (
                <FeeType
                  key={type}
                  type={`${capitalizeFirstLetter(type)} fees`}
                >
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
          <SimpleButton
            buttonProps={{
              type: "button",
              disabled: selectedItems.length === 0,
            }}
            predefinedColor="success"
          >
            Proceed to pay
          </SimpleButton>
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
