import { cn } from "@/lib/cn";
import { useNavigate } from "react-router-dom";

const LinkButton = ({ className, buttonProps, to, navigateProps, children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to, navigateProps);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      {...buttonProps}
      className={cn("text-blue-500 hover:underline cursor-pointer", className)}
    >
      {children}
    </button>
  );
};

export default LinkButton;
