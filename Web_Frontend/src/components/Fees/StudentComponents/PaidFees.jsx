import PaidFeesCard from "./PaidFeesCard";
import FeeType from "./FeeType";
import { capitalizeFirstLetter } from "@/utils/textUtils";

const FEE_TYPE_LABELS = {
  academic: "Tuition Fee",
  transport: "Transport Fee",
  other: "Other Fee",
};

const PaidFees = ({ isPaid, feesData }) => {
  return (
    <>
      <h1 className="text-2xl font-bold m-3">Paid</h1>
      {isPaid ? (
        Object.entries(feesData).map(
          ([type, fees]) =>
            fees.length !== 0 && (
              <FeeType key={"Paid" + type} type={`${capitalizeFirstLetter(type)} fees`}>
                {/* Header - Only visible on sm and above */}
                <div className="hidden sm:flex px-5 py-2 font-bold w-full border-2">
                  <h3 className="w-[35%]">Fee Name</h3>
                  <h3 className="w-[15%]">Date</h3>
                  <h3 className="w-[15%] lg:w-[20%]">Payment Mode</h3>
                  <h3>Amount</h3>
                </div>

                {/* Fee entries */}
                {fees.map((element) => (
                  <PaidFeesCard
                    key={"Paid" + element._id}
                    feeData={{
                      ...element,
                      feeType: FEE_TYPE_LABELS[type] || capitalizeFirstLetter(type) + " Fee",
                    }}
                  />
                ))}
              </FeeType>
            )
        )
      ) : (
        <p className="ml-4">No payments made yet.</p>
      )}
    </>
  );
};

export default PaidFees;
