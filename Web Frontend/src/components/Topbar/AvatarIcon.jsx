import React from "react";
import { cn } from "@/lib/utils";
import colorFromName from "@/lib/colorFromName";
import { capitalizeFirstLetter } from "@/lib/utils";

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
    container: "size-22",
    text: "text-5xl",
  },
};

const AvatarIcon = ({ size = "small", withHover = true, callback=null, user }) => {
  const initial = capitalizeFirstLetter(user.fullName.at(0) || "");
  const { container, text } = sizeMap[size] || sizeMap.small;

  return (
    <div
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
