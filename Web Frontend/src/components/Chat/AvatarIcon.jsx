import { cn } from "@/lib/cn";
import colorFromName from "@/lib/colorFromName";
import { capitalizeFirstLetter } from "@/utils/textUtils";

const sizeMap = {
  small: {
    container: "size-8",
    text: "text-lg",
  },
  medium: {
    container: "size-15",
    text: "text-3xl",
  },
  large: {
    container: "size-35",
    text: "text-6xl",
  },
};

const AvatarIcon = ({
  ref,
  size = "small",
  withHover = true,
  callback = null,
  user,
}) => {
  const initial = capitalizeFirstLetter(user.fullName.at(0) || "");
  const { container, text } = sizeMap[size] || sizeMap.small;

  return (
    <div
      ref={ref}
      onClick={callback}
      className={cn(
        "flex items-center justify-center text-center rounded-full overflow-hidden bg-cover ring-gray-500 dark:ring-white",
        container,
        withHover && "cursor-pointer hover:ring-1 focus:ring-1"
      )}
      style={{
        ...(user.avatar ? {} : { backgroundColor: colorFromName(initial) }),
      }}
    >
      {!user.avatar ? (
        <h1 className={cn("font-bold text-white", text)}>{initial}</h1>
      ) : (
        <img
          src={user.avatar}
          alt="User Profile Picture"
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
};

export default AvatarIcon;
