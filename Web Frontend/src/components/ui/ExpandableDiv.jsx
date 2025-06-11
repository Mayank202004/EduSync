import { cn } from "@/lib/cn";

const ExpandableDiv = ({ containerRef, height, className, children }) => {
  return (
    <div
      ref={containerRef}
      className={cn(className)}
      style={{
        maxHeight: `${height}px`,
        transition: "max-height 0.3s ease",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default ExpandableDiv;
