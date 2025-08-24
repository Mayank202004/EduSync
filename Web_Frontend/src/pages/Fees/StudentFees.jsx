import { useEffect, useState } from "react";
import PaymentFAQs from "@/components/Fees/StudentComponents/FAQs";
import RaiseTicket from "@/components/Fees/StudentComponents/RaiseTicket";
import PendingFees from "@/components/Fees/StudentComponents/PendingFees";
import PaidFees from "@/components/Fees/StudentComponents/PaidFees";
import { getUserFees } from "@/services/feeService";
import FeeCardSkeleton from "@/components/Fees/StudentComponents/FeeCardSkeleton";
import { Banknote } from "lucide-react";

const Fees = () => {
  const [feesData, setFeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await getUserFees();
        setFeesData(response.data);
      } catch (_) {
        // handle error later
      } finally {
        setIsLoading(false);
      }
    };
    fetchFees();
  }, []);

  let isPending = false,
    isPaid = false;

  if (!isLoading && feesData.length !== 0) {
    isPending = Object.values(feesData.pending).some((v) => v.length > 0);
    isPaid = Object.values(feesData.paid).some((v) => v.length > 0);
  }

  return (
    <div className="tablet:flex min-h-screen w-full px-4  bg-customLightBg dark:bg-zinc-950">
      {/* Left Sidebar */}
      <div className="tablet:sticky self-start top-0 left-0 bottom-0 h-fit tablet:w-3/10 pr-3">
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-sm flex flex-col items-start gap-3 px-3 py-2 mt-5">
          <div className="flex items-start gap-2">
            <Banknote className="text-green-600 w-8 h-8" />
            <h1 className="font-semibold text-2xl text-gray-800 dark:text-white">
              Fees
            </h1>
          </div>
        </div>
      </div>

      {/* Center Content */}
      {isLoading ? (
        <div className="tablet:min-w-[60%] py-6 flex flex-col border-x h-full w-full">
          <FeeCardSkeleton />
          <FeeCardSkeleton />
          <FeeCardSkeleton />
        </div>
      ) : (
        <div className="tablet:min-w-[65%] p-4 tablet:mr-0 w-full tablet:h-full border-x">
          <PendingFees isPending={isPending} feesData={feesData.pending} />
          <hr className="mt-6" />
          <PaidFees isPaid={isPaid} feesData={feesData.paid} />
        </div>
      )}

      <hr className="tablet:hidden" />

      {/* Right Sidebar (unchanged as requested) */}
      <div className="flex flex-col tablet:sticky self-start top-0 right-0 bottom-0 h-fit tablet:w-1/2">
        <PaymentFAQs />
        <RaiseTicket />
      </div>
    </div>
  );
};

export default Fees;
