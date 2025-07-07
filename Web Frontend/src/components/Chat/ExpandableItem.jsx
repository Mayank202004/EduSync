import useExpandable from "@/hooks/useExpandable";
import { cn } from "@/lib/cn";

const ExpandableItem = ({
  containerStyle,
  title,
  titleStyle,
  titleContainerStyle,
  children,
  childrenContainerStyle,
  defaultExpanded = false,
}) => {
  const { expanded, setExpanded, height, containerRef } =
    useExpandable(defaultExpanded);

  return (
    <div className={cn(containerStyle)}>
      <div
        className={cn(
          "cursor-pointer font-semibold mb-1 flex justify-between items-center",
          titleContainerStyle
        )}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className={cn(titleStyle)}>{title}</span>
        <span className="ml-1">{expanded ? "−" : "+"}</span>
      </div>

      <div
        ref={containerRef}
        className={cn(childrenContainerStyle)}
        style={{
          maxHeight: `${height}px`,
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ExpandableItem;
