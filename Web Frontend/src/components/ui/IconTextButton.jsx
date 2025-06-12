import { cn } from "@/lib/cn";

const IconTextButton = ({
  className,
  buttonProps,
  textStyle,
  text,
  icon = null,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "hover:bg-gray-300 dark:hover:bg-gray-700 rounded-sm p-2 cursor-pointer space-x-1.5",
        className
      )}
      {...buttonProps}
    >
      {icon}
      {text && <span className={cn(textStyle)}>{text}</span>}
    </button>
  );
};

export default IconTextButton;
