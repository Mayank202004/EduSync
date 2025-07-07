import { cn } from "@/lib/cn";

const BUTTON_STYLES = {
  default:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  danger:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  success:
    "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  info: "bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-white dark:hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  custom: "",
};

/**
 * A simple customizable button component with predefined color styles.
 *
 * @component
 * @param {Object} props.buttonProps - native properties of html buttons like onClick, type, etc..
 * @param {string} [props.className] - Additional CSS classes for custom styling.
 * Supports style merging using {@link https://github.com/lukeed/clsx | clsx} and {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 * @param {string} [props.predefinedColor="blue"] - A predefined color key from BUTTON_STYLES. Defaults to "primary".
 *
 * @example
 * <SimpleButton
 *   buttonProps={{ onClick: handleSave }}
 *   className="text-white"
 *   predefinedColor="primary"
 * />
 */
const SimpleButton = ({
  buttonProps,
  className,
  predefinedColor = "primary",
  children,
}) => {
  const buttonColor =
    BUTTON_STYLES[predefinedColor] || BUTTON_STYLES["primary"];
  return (
    <button
      {...buttonProps}
      className={cn(
        "cursor-pointer py-2 px-4 w-fit flex ml-auto rounded-sm duration-200 justify-center",
        buttonColor,
        className
      )}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
