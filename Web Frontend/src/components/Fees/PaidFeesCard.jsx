import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faAngleRight,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import Tag from "./Tag";
import FeeCard from "./FeeCard";

const COLOR_MAP = {
  Cash: 'green',
  Online: 'blue',
  UPI: 'purple',
  Cheque: 'orange'
}

const PaidFeesCard = ({ feeData }) => {
  const [expanded, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (expanded) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <>
      <div className="w-[95%] mx-auto mb-3 flex flex-column place-items-center">
        <button
          className="cursor-pointer w-3 aspect-square"
          onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
        >
          <FontAwesomeIcon icon={expanded ? faAngleDown : faAngleRight} />
        </button>
        <h1 className="font-bold text-2xl ml-2 truncate w-fit">
          {feeData.title}
        </h1>
        <Tag className="mx-2" text={feeData.mode} color={COLOR_MAP[feeData.mode]}/>
        <button className="min-w-fit ml-auto border-2 border-black dark:border-white rounded-sm p-2 cursor-pointer duration-200 hover:bg-gray-300 dark:hover:bg-customDarkFg">
          <FontAwesomeIcon icon={faDownload} /> Receipt
        </button>
      </div>
      <div
        ref={contentRef}
        style={{
          maxHeight: `${height}px`,
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        <FeeCard feeData={feeData} isSelectable={false} />
      </div>
    </>
  );
};

export default PaidFeesCard;
