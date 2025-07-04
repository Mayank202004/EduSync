import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faAngleRight,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import useExpandable from "@/hooks/useExpandable";
import ExpandableDiv from "@/components/ui/ExpandableDiv";
import Tag from "./Tag";
import FeeCard from "./FeeCard";
import { exportFee } from "@/services/feeService";

const COLOR_MAP = {
  Cash: "green",
  Online: "blue",
  UPI: "purple",
  Cheque: "orange",
};

const PaidFeesCard = ({ feeData }) => {
  const { containerRef, height, expanded, setExpanded } = useExpandable(false);


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
    <>
      <div className="w-[95%] mx-auto mb-3 flex flex-column place-items-center">
        <button
          className="cursor-pointer w-3 aspect-square"
          onClick={() => setExpanded((prevIsOpen) => !prevIsOpen)}
        >
          <FontAwesomeIcon icon={expanded ? faAngleDown : faAngleRight} />
        </button>
        <h1 className="font-bold text-2xl ml-2 truncate w-fit">
          {feeData.title}
        </h1>
        <Tag
          className="mx-2"
          text={feeData.mode}
          color={COLOR_MAP[feeData.mode]}
        />
        <button 
          onClick={() => handleExportFeeReceipt({
            transactionId: feeData.transactionId, // Do to : Make dynamic
            structureId: feeData.structureId,
            feeType: feeData.feeType,
            title: feeData.title,
            receiptNo: "g8gheriu4hfife" // To Do : Make dynamic
          })} className="min-w-fit ml-auto border-2 border-black dark:border-white rounded-sm p-2 cursor-pointer duration-200 hover:bg-gray-300 dark:hover:bg-customDarkFg">
            <FontAwesomeIcon icon={faDownload} /> Receipt
        </button>
      </div>
      <ExpandableDiv containerRef={containerRef} height={height}>
        <FeeCard feeData={feeData} isSelectable={false} />
      </ExpandableDiv>
    </>
  );
};

export default PaidFeesCard;
