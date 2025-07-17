import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import Tag from "./Tag";
import { exportFee } from "@/services/feeService";
import { formatDate } from "@/utils/dateUtils";

const COLOR_MAP = {
  Cash: "green",
  Online: "blue",
  UPI: "purple",
  Cheque: "orange",
};

const PaidFeesCard = ({ feeData }) => {
  const handleExportFeeReceipt = ({
    transactionId,
    structureId,
    feeType,
    title,
    receiptNo,
  }) => {
    exportFee(transactionId, structureId, feeType, title, receiptNo);
  };

  return (
    <div className="bg-white dark:bg-customDarkFg py-3">
      <div className="flex items-center w-full px-5 justify-between">
        <div className="w-[29%] truncate text-lg">{feeData.title}</div>
        <div className="w-[12%]">{formatDate(feeData.paidOn)}</div>
        <div className="w-[13%]">
          <Tag
            text={feeData.mode}
            color={COLOR_MAP[feeData.mode]}
          />
        </div>
        <div className="w-[15%]">₹{feeData.amount}</div>
        <div className="">
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
            className="border border-black dark:border-white rounded-sm px-2 py-1 cursor-pointer duration-200 hover:bg-gray-300 dark:hover:bg-customDarkFg"
          >
            <FontAwesomeIcon icon={faDownload} /> Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaidFeesCard;
