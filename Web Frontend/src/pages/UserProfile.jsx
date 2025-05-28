import { useAuth } from "@/auth/AuthContext";
import AvatarIcon from "@/components/Topbar/AvatarIcon";
import { capitalizeFirstLetter } from "@/lib/utils";
import EditAccountDetails from "@/components/UserProfile/EditAccountDetails";
import PhotoPreview from "@/components/UserProfile/PhotoPreview";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-full w-full bg-customLightBg dark:bg-customDarkBg">
      <h1 className="font-bold text-4xl w-fit mx-auto mt-10">Edit Profile</h1>
      <h3 className="mx-auto text-lg text-gray-400">
        {capitalizeFirstLetter(user.role)}
      </h3>
      <section className="min-w-2xs max-w-3xl w-full grid py-6 mx-auto bg-white dark:bg-customDarkFg rounded-md my-6">
        <h2 className="font-bold mx-6 sm:mx-10 md:mx-15 mt-6 mb-2.5">Photo preview</h2>
        <PhotoPreview user={user}/>
        <h2 className="font-bold mx-6 sm:mx-10 md:mx-15 mt-4 mb-2.5">Account details</h2>
        <EditAccountDetails user={user} />
        <button
          type="button"
          className="cursor-pointer py-2 px-4 w-fit mr-10 ml-auto rounded-sm bg-blue-300 dark:bg-blue-400 hover:bg-blue-400 dark:hover:bg-blue-300 duration-200"
        >
          Save
        </button>
      </section>
    </div>
  );
};

export default UserProfile;
