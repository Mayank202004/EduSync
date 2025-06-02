import { cn } from "@/lib/utils";

/**
 * A reusable outlined button with active and inactive styles.
 *
 * @component
 * @param {string} [props.text] - The button label text.
 * @param {boolean} [props.isActive] - If true, applies active styling.
 * @param {function} [props.onClick] - Click handler function.
 * @param {string} [props.className] - Additional Tailwind/utility classes for styling.
 *
 * @example
 * <OutlinedButton
 *   text="Filter"
 *   isActive={selected}
 *   onClick={() => setSelected(!selected)}
 * />
 */
const OutlinedButton = ({ buttonProps, className, children }) => {
  return (
    <button
      {...buttonProps}
      className={cn(
        "cursor-pointer py-1.5 px-4 rounded-sm border transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
