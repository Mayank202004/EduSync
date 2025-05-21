import { cn } from "@/lib/utils";

const FeeCard = ({
  feeData,
  selectedFees = null,
  selectFee = null,
  deselectFee = null,
  isSelectable = true, //represents fees paid
}) => {
  const isSelected = selectedFees?.includes(feeData._id);

  return (
    <li className="w-full flex md:px-2 pb-6">
      {isSelectable && (
        <button
          type="button"
          className={cn(
            "cursor-pointer fade-in-translate-full h-fit relative mr-2 p-2 my-auto rounded-full border-black dark:border-white border-1 after:content-[''] after:inset-0 after:scale-[70%] after:rounded-full after:bg-blue-600 after:absolute after:hidden",
            {
              "after:block": isSelected,
            }
          )}
          onClick={
            isSelected
              ? () => deselectFee(feeData._id)
              : () => selectFee(feeData._id)
          }
        ></button>
      )}
      <div
        className={cn(
          "w-[95%] mx-auto p-3 border-1 bg-white dark:bg-customDarkFg border-gray-600 rounded-lg dark:border-gray-200",
          {
            "border-2 border-blue-500 ring-blue-200 ring-2 shadow-md":
              isSelected,
          }
        )}
      >
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl truncate w-fit">{feeData.title}</h2>
          <h1 className="font-bold text-xl mr-2">&#x20B9;{feeData.amount}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {isSelectable
            ? `Due Date: ${new Date(feeData.dueDate).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                }
              )}`
            : `Paid On: ${new Date(feeData.paidOn).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true
              })}`}
        </p>
        <hr className="my-2" />
        <p className="line-clamp-1">Description: Yearly fees</p>
      </div>
    </li>
  );
};

export default FeeCard;
