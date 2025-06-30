import { cn } from "@/lib/cn";

const ModalWrapper = ({ className, children }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
