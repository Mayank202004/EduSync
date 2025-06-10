import { cn } from "@/lib/utils";
const LinkButton = ({ className, buttonProps, text }) => {
  return (
    <button
      type="button"
      {...buttonProps}
      className={cn("text-blue-500 hover:underline cursor-pointer", className)}
    >
      {text}
    </button>
  );
};

export default LinkButton;
