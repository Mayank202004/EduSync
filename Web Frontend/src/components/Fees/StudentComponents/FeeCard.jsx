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
          "w-full mx-auto p-4 border-1 bg-white dark:bg-customDarkFg rounded-md",
          {
            "border-2 border-blue-500 ring-blue-200 ring-2 shadow-md": isSelected,
          }
        )}
      >
        {/* Title with checkbox */}
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
            />
          )}
          <h2 className="font-bold text-lg truncate">Pay {feeData.title}</h2>
        </div>

        <hr className="my-3 border-t-1 border-gray-300 dark:border-gray-600" />

        {/* Fee Info - Responsive Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full px-2">
          {/* Fee Name */}
          <div className="sm:w-[35%] w-full truncate text-sm sm:text-base font-medium">
            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">
              Fee Name
            </div>
            {feeData.title}
          </div>

          {/* Due Date */}
          <div className="sm:w-[20%] w-full text-sm sm:text-center text-left">
            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">
              Due Date
            </div>
            {formatDate(feeData.dueDate ?? feeData.paidOn)}
          </div>

          {/* Due Status */}
          <div className="sm:w-[15%] w-full text-sm text-left">
            {isDueSoon ? (
              <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full font-semibold">
                Due
              </span>
            ) : (
              <span className="hidden sm:inline-block sm:invisible text-sm px-3 py-1 rounded-full font-semibold">
                Due
              </span>
            )}
          </div>

          {/* Amount */}
          <div className="sm:w-[20%] w-full text-sm sm:text-right text-left font-bold text-xl text-gray-800 dark:text-white">
            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1">
              Amount
            </div>
            ₹{feeData.amount.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </li>
  );
};

export default FeeCard;
