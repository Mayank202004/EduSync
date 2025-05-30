import { useAuth } from "@/auth/AuthContext";
import AvatarIcon from "@/components/Topbar/AvatarIcon";
import { capitalizeFirstLetter } from "@/lib/utils";
import EditAccountDetails from "@/components/UserProfile/EditAccountDetails";
import PhotoPreview from "@/components/UserProfile/PhotoPreview";
import { useState, useActionState } from "react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

import updateUserApi from "@/services/profileService";

const UserProfile = () => {
  const { user } = useAuth();
  const [blob, setBlob] = useState(null);
  const [profileData, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      // const { username, fullName, avatar } = formData;
      const username = formData.get("username");
      const fullName = formData.get("fullName");
      const avatar = formData.get("avatar");

      console.log(username, fullName, avatar);
      if (!username?.trim() || !fullName?.trim()) {
        toast.error("Username and Full Name cannot be empty");
        return prevState;
      }

      if (!blob) {
        toast.error("No avatar image selected");
        return prevState;
      }

      try {
        const tempFormData = new FormData();
        if (avatar !== user.avatar) {
          const compressedBlob = await imageCompression(blob, {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          });
          tempFormData.append("avatar", compressedBlob);
        }

        const apiCall = async () => {
          return await updateUserApi(
            username,
            fullName,
            avatar !== user.avatar ? tempFormData : null
          );
        };

        const { userDataRes, avatarDataRes } = await toast.promise(apiCall, {
          loading: "Updating profile...",
          success: "Profile updated successfully",
          error: "Failed to update profile",
        });

        // If backend sends a specific error inside the response (e.g. validation fail)
        if (userDataRes?.data?.error || avatarDataRes?.data?.error) {
          toast.error(
            userDataRes?.data?.error ||
              avatarDataRes?.data?.error ||
              "Something went wrong"
          );
          return prevState;
        }

        // All went fine — refresh page or update UI
        window.location.reload();

        return {
          username,
          fullName,
          avatar:
            avatar !== user.avatar ? avatarDataRes?.data?.data?.avatar : avatar,
        };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Unknown error occurred";
        toast.error(message);
        return prevState;
      }
    },
    {
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
    }
  );

  const handleBlob = (blobData) => {
    setBlob(blobData);
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-customLightBg dark:bg-customDarkBg">
      <h1 className="font-bold text-4xl w-fit mx-auto mt-10">Edit Profile</h1>
      <h3 className="mx-auto text-lg text-gray-400">
        {capitalizeFirstLetter(user.role)}
      </h3>
      <form
        action={formAction}
        className="min-w-2xs max-w-3xl w-full grid py-6 mx-auto bg-white dark:bg-customDarkFg rounded-md my-6"
      >
        <h2 className="font-bold mx-6 text-lg sm:mx-10 md:mx-15 mt-6 mb-2.5">
          Photo preview
        </h2>
        <PhotoPreview user={profileData} onBlobReady={handleBlob} />
        <h2 className="font-bold mx-6 text-lg sm:mx-10 md:mx-15 mt-4 mb-2.5">
          Account details
        </h2>
        <EditAccountDetails user={profileData} />
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer py-2 px-4 w-fit mr-10 ml-auto rounded-sm bg-blue-300 dark:bg-blue-400 hover:bg-blue-400 dark:hover:bg-blue-300 duration-200"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
