import { cn } from "@/lib/cn";

const IconTextButton = ({
  ref,
  className,
  buttonProps,
  textStyle,
  text,
  icon = null,
}) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm p-2 cursor-pointer space-x-1.5",
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
