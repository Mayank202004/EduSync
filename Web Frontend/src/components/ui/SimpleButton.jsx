import { cn } from "@/lib/cn";

const BUTTON_STYLES = {
  blue: "bg-blue-300 dark:bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-400 disabled:opacity-50",
  green: "bg-green-400 text-black hover:not-disabled:bg-green-600 disabled:opacity-50",
  gray: "bg-gray-300 dark:bg-gray-600 hover:not-disabled:bg-gray-400 disabled:opacity-50",
  custom: " "
}

/**
 * A simple customizable button component with predefined color styles.
 *
 * @component
 * @param {Object} props.buttonProps - native properties of html buttons like onClick, type, etc..
 * @param {string} [props.className] - Additional CSS classes for custom styling. 
 * Supports style merging using {@link https://github.com/lukeed/clsx | clsx} and {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 * @param {string} [props.predefinedColor="blue"] - A predefined color key from BUTTON_STYLES. Defaults to "blue".
 *
 * @example
 * <SimpleButton
 *   buttonProps={{ onClick: handleSave }}
 *   className="text-white"
 *   predefinedColor="blue"
 * />
 */
const SimpleButton = ({ buttonProps, className, predefinedColor="blue", children }) => {
  const buttonColor = BUTTON_STYLES[predefinedColor] || BUTTON_STYLES["blue"]
  return (
    <button
      {...buttonProps}
      className={cn("cursor-pointer py-2 px-4 w-fit flex ml-auto rounded-sm duration-200 justify-center", buttonColor, className)}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
