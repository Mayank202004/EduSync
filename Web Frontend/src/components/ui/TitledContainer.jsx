import { cn } from "@/lib/utils";

/**
 * A reusable container component with a title and styled content.
 *
 * Useful for grouping sections in forms or settings pages with a heading.
 *
 * @param {string} props.title - The title displayed at the top of the container.
 * @param {React.ReactNode} props.children - The content inside the container.
 * @param {string} [props.titleStyle] - Optional custom CSS classes for styling the title.
 * @param {string} [props.containerStyle] - Optional custom CSS classes for styling the container box.
 * Supports style merging using {@link https://github.com/lukeed/clsx | clsx} and {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 *
 * @example
 * <TitledContainer title="User Info" titleStyle="text-blue-600" containerStyle="my-4">
 *   <Input ... />
 * </TitledContainer>
 */
const TitledContainer = ({ title, children, titleStyle, containerStyle }) => {
  return (
    <div
      className={cn(
        "container rounded-md py-6 px-6 sm:px-10 md:px-15 bg-white dark:bg-customDarkFg",
        containerStyle
      )}
    >
      <h2 className={cn("font-bold text-lg mb-3", titleStyle)}>{title}</h2>
      {children}
    </div>
  );
};

export default TitledContainer;
