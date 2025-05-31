import PaidFeesCard from "./PaidFeesCard";
import FeeType from "./FeeType";
import { capitalizeFirstLetter } from "@/lib/utils";

const PaidFees = ({ isPaid, feesData }) => {
  //keys prepended with paid so react can distinguish between paid and pending componenets as they reuse the same componenets
  return (
    <>
      <h1 className="text-2xl font-bold m-3">Paid</h1>
      {isPaid ? (
        Object.entries(feesData).map(([type, fees]) =>
          fees.length === 0 ? undefined : (
            <FeeType
              key={"Paid" + type}
              type={`${capitalizeFirstLetter(type)} fees`}
            >
              {fees.map((element) => (
                <PaidFeesCard key={"Paid" + element._id} feeData={element} />
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
