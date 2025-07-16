import { cn } from "@/lib/cn";
import { formatDate } from "@/utils/dateUtils";

const FeeCard = ({
  feeData,
  selectedFees = null,
  selectFee = null,
  deselectFee = null,
  isSelectable = true,
}) => {
  const isSelected = selectedFees?.includes(feeData._id);

  const today = new Date();
  const dueDate = new Date(feeData.dueDate);
  const thresholdDate = new Date(dueDate);
  thresholdDate.setDate(thresholdDate.getDate() - 15);

  const isDueSoon = today > thresholdDate;

  return (
    <li className="w-full shrink-0 flex md:px-2 pb-6">
      <div
        className={cn(
          "w-[95%] mx-auto p-4 border-1 bg-white dark:bg-customDarkFg rounded-md",
          {
            "border-2 border-blue-500 ring-blue-200 ring-2 shadow-md":
              isSelected,
          }
        )}
      >
        <div className="flex items-center mb-2">
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
          <h2 className="font-bold text-lg truncate">Pay {feeData.title}</h2>
        </div>

        <hr className="my-3 border-t-1 border-gray-300 dark:border-gray-600" />

        <div className="flex justify-between items-center w-full px-10">
          <h3 className="font-medium">{feeData.title}</h3>
          <h3 className="font-medium">{formatDate(feeData.dueDate)}</h3>
          {isDueSoon && (
            <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full font-semibold">
              Due
            </span>
          )}
          <h1 className="font-bold text-xl text-gray-800 dark:text-white">
            ₹{feeData.amount.toLocaleString("en-IN")}
          </h1>
        </div>
      </div>
    </li>
  );
};

export default FeeCard;
