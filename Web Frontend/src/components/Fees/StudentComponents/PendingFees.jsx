import { useState } from "react";
import FeeCard from "./FeeCard";
import FeeType from "./FeeType";
import SimpleButton from "@/components/UI/SimpleButton";
import { capitalizeFirstLetter } from "@/utils/textUtils";
import axios from "axios";

const PendingFees = ({ isPending, feesData }) => {
  const [selectedItems, setSelectedItems] = useState({}); // { type1: [id1, id2], type2: [id3] }
  const [loadingType, setLoadingType] = useState(null);

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

  const handleProceedToPay = async (type) => {
    const selectedIds = selectedItems[type];
    if (!selectedIds || selectedIds.length === 0) return;

    const feesToPay = (feesData[type] || [])
      .filter((fee) => selectedIds.includes(fee._id))
      .map((fee) => ({
        structureId: fee._id,
        amount: fee.amount
      }));

    const payload = {
      feeType: type,
      transactionId: `TXN${Date.now()}`, // To Do: replace with real txn id from payment gateway
      mode: "Online",
      fees: feesToPay
    };

    try {
      setLoadingType(type);
      // const res = await axios.post("/api/fees/mark-paid", payload, {
      //   withCredentials: true
      // });
      console.log(payload)
      console.log("Payment success:", res.data);

      // Clear selection after success
      setSelectedItems((prev) => ({
        ...prev,
        [type]: []
      }));
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
    } finally {
      setLoadingType(null);
    }
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
                          onClick: () => handleProceedToPay(type),
                          disabled: loadingType === type
                        }}
                        predefinedColor="success"
                      >
                        {loadingType === type ? "Processing..." : "Proceed to pay"}
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
