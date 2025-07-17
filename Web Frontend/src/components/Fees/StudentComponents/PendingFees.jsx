import { useState } from "react";
import FeeCard from "./FeeCard";
import FeeType from "./FeeType";
import SimpleButton from "@/components/Chat/SimpleButton";
import { capitalizeFirstLetter } from "@/utils/textUtils";

const PendingFees = ({ isPending, feesData }) => {
  const [selectedItems, setSelectedItems] = useState({}); // { type1: [id1, id2], type2: [id3] }

  const selectFee = (type, id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), id],
    }));
  };

  const deselectFee = (type, id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((itemId) => itemId !== id),
    }));
  };

  return (
    <>
      <h1 className="text-2xl font-bold m-3">Pending</h1>
      {isPending ? (
        <>
          {Object.entries(feesData).map(
            ([type, fees]) =>
              fees.length !== 0 && (
                <div key={type} className="mb-6">
                  <FeeType type={`${capitalizeFirstLetter(type)} fees`}>
                    {fees.map((element) => (
                      <FeeCard
                        key={element._id}
                        feeData={element}
                        selectedFees={selectedItems[type] || []}
                        selectFee={(id) => selectFee(type, id)}
                        deselectFee={(id) => deselectFee(type, id)}
                      />
                    ))}
                  </FeeType>

                  {/* Total and button per fee type */}
                  {selectedItems[type]?.length > 0 && (
                    <div className="flex justify-between items-center px-4 mt-2">
                      <span className="text-lg font-semibold">
                        Total: ₹
                        {fees
                          .filter((fee) =>
                            selectedItems[type].includes(fee._id)
                          )
                          .reduce((sum, fee) => sum + fee.amount, 0)
                          .toLocaleString("en-IN")}
                      </span>
                      <SimpleButton
                        buttonProps={{
                          type: "button",
                        }}
                        predefinedColor="success"
                      >
                        Proceed to pay
                      </SimpleButton>
                    </div>
                  )}
                </div>
              )
          )}
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
