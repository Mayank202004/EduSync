import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Tag from "./Tag";
import { exportFee } from "@/services/feeService";
import { formatDate } from "@/utils/dateUtils";
import toast from "react-hot-toast";

const COLOR_MAP = {
  Cash: "green",
  Online: "blue",
  Offline: "green",
  UPI: "purple",
  Cheque: "orange",
  DD:"red"
};

const PaidFeesCard = ({ feeData }) => {
  const handleExportFeeReceipt = ({
    transactionId,
    structureId,
    feeType,
    title,
    receiptNo,
  }) => {
    toast.promise(
      exportFee(transactionId, structureId, feeType, title, receiptNo),
      {
        loading: "Exporting fee receipt...",
        success: "Fee receipt exported successfully.",
        error: "",
      }
    )
  };

  return (
    <div className="bg-white dark:bg-customDarkFg py-3 px-4 border-b-1">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Title */}
      <div className="sm:w-[29%] w-full truncate text-base sm:text-lg font-medium">
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">Fee Name</div>
        {feeData.title}
      </div>

      {/* Paid Date */}
      <div className="sm:w-[12%] w-full text-sm sm:text-base">
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">Paid On</div>
        {formatDate(feeData.paidOn)}
      </div>

      {/* Payment Mode */}
      <div className="sm:w-[13%] w-full">
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Mode</div>
        <Tag text={feeData.mode} color={COLOR_MAP[feeData.mode]} />
      </div>

      {/* Amount */}
      <div className="sm:w-[15%] w-full text-sm sm:text-base font-semibold">
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</div>
        ₹{feeData.amount}
      </div>

      {/* Download Button */}
      <div className="w-full sm:w-auto">
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">Receipt</div>
        <button
          onClick={() =>
            handleExportFeeReceipt({
              transactionId: feeData.transactionId,
              structureId: feeData.structureId,
              feeType: feeData.feeType,
              title: feeData.title,
              receiptNo: "g8gheriu4hfife", // TODO: Make dynamic
            })
          }
          className="w-full sm:w-auto border border-black dark:border-white rounded-sm px-2 py-1 text-sm cursor-pointer duration-200 hover:bg-gray-300 dark:hover:bg-customDarkFg"
        >
          <FontAwesomeIcon icon={faDownload} /> Receipt
        </button>
      </div>
    </div>
  </div>
  );
};

export default PaidFeesCard;
