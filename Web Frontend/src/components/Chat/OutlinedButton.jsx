import { cn } from "@/lib/cn";

const OUTLINED_BUTTON_STYLES = {
  default: "border-gray-400 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700",
  primary: "border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-400 dark:hover:bg-blue-900",
  danger: "border-red-500 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900",
  success: "border-green-500 text-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-500 dark:hover:bg-green-900",
  info: "border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-300 dark:border-cyan-400 dark:hover:bg-cyan-900",
  custom: " "
};

/**
 * A reusable outlined button with optional predefined styling.
 *
 * @param {Object} props.buttonProps - Native button props.
 * @param {string} [props.className] - Additional classes.
 * @param {string} [props.variant="default"] - One of "default", "primary", "danger", "success".
 */
const OutlinedButton = ({ buttonProps, className, variant = "default", children }) => {
  const variantClass = OUTLINED_BUTTON_STYLES[variant] || OUTLINED_BUTTON_STYLES.default;

  return (
    <button
      {...buttonProps}
      className={cn(
        "cursor-pointer py-1.5 px-4 rounded-sm border transition-colors duration-200",
        variantClass,
        className
      )}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
