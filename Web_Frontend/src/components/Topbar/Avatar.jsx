import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useClickOutside from "@/hooks/useClickOutside";

import { faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarIcon from "../Chat/AvatarIcon";
import IconTextButton from "../Chat/IconTextButton";
import { useAuth } from "@/context/AuthContext";

import { cn } from "@/lib/cn";

const Avatar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [containerRef, ignoreContainerRef] = useClickOutside(() => setIsOpen(false));

  const logoutUser = async () => {
    toast.promise(logout, {
      loading: "Logging out...",
      success: "Logged Out",
      error: "Failed",
    });
    await logout();
    navigate("/login");
  };

  const editProfile = () => {
    setIsOpen(false);
    navigate("user/edit");
  };

  return (
    <div ref={containerRef}>
      <AvatarIcon ref={ignoreContainerRef} user={user} callback={() => setIsOpen((prev) => !prev)} />
      <div
        className={cn(
          "absolute right-2 mt-4 w-max bg-customLightBg dark:bg-customDarkBg py-5 px-10 rounded-sm ring-1 ring-gray-500 z-10 flex flex-col gap-3 transition-tranform duration-100 origin-top-right",
          isOpen ? "scale-100" : "scale-0"
        )}
      >
        <IconTextButton
          buttonProps={{ onClick: () => setIsOpen(false) }}
          className="absolute top-4 right-4 size-8 p-0 rounded-full"
          icon={<FontAwesomeIcon icon={faXmark} className="fa-lg" />}
        />
        <div className="flex flex-col max-w-[70vw] place-items-center">
          <AvatarIcon size={"medium"} withHover={false} user={user} />
          <h1 className="font-bold text-xl mt-2 text-wrap text-center">
            {user.fullName}
          </h1>
          <IconTextButton
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline hover:bg-transparent dark:hover:bg-transparent py-0"
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            text="Edit Profile"
            buttonProps={{ onClick: editProfile }}
          />
        </div>
        <hr />
        <IconTextButton
          icon={<FontAwesomeIcon icon={faRightFromBracket} />}
          className="text-red-400 dark:text-red-400"
          text="Logout"
          buttonProps={{ onClick: logoutUser }}
        />
      </div>
    </div>
  );
};

export default Avatar;