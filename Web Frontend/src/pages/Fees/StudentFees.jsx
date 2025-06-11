import { useEffect, useState } from "react";
import PaymentFAQs from "@/components/Fees/FAQs";
import RaiseTicket from "@/components/Fees/RaiseTicket";
import PendingFees from "@/components/Fees/StudentComponents/PendingFees";
import PaidFees from "@/components/Fees/StudentComponents/PaidFees";
import { getUserFees } from "@/services/feeService";
import FeeCardSkeleton from "@/components/Fees/StudentComponents/FeeCardSkeleton";

const Fees = () => {
  const [feesData, setFeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await getUserFees();
        setFeesData(response.data);
      } catch (_) {
        //handle later
      } finally {
        setIsLoading(false);
      }
    };
    fetchFees();
  }, []);

  let isPending, isPaid;
  if (!isLoading && feesData.length !== 0) {
    isPending = Object.values(feesData.pending).some(
      (value) => value.length !== 0
    );

    isPaid = Object.values(feesData.paid).some((value) => value.length !== 0);
  }

  return (
    <div className="tablet:flex min-h-full w-full">
      <div className="tablet:w-3/10 tablet:h-full tablet:grow">
        <h1 className="font-bold text-3xl mt-4 w-fit mx-auto tablet:mt-10 tablet:mb-2">
          Fees
        </h1>
        <p className="w-fit mx-auto text-center text-lg text-gray-500">
          Academic year: 2025-26
        </p>
      </div>
      {isLoading ? (
        <div className="tablet:min-w-[60%] py-6 flex flex-col border-x-1 h-full w-full">
          <FeeCardSkeleton />
          <FeeCardSkeleton />
          <FeeCardSkeleton />
        </div>
      ) : (
        <div className="tablet:min-w-[60%] p-4 tablet:mr-0 w-full tablet:h-full border-x-1">
          <PendingFees isPending={isPending} feesData={feesData.pending} />
          <hr className="mt-6" />
          <PaidFees isPaid={isPaid} feesData={feesData.paid} />
        </div>
      )}
      <hr className="tablet:hidden" />
      <div className="flex flex-col tablet:w-1/2 tablet:min-h-full">
        <PaymentFAQs />
        <RaiseTicket />
      </div>
    </div>
  );
};

export default Fees;
