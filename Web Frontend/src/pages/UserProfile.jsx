import { useAuth } from "@/auth/AuthContext";
import AvatarIcon from "@/components/Topbar/AvatarIcon";
import { capitalizeFirstLetter } from "@/lib/utils";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-full w-full bg-customLightBg dark:bg-customDarkBg">
      <h1 className="font-bold text-4xl w-fit mx-auto mt-10">Edit Profile</h1>
      <h3 className="mx-auto text-lg text-gray-400">
        {capitalizeFirstLetter(user.role)}
      </h3>
      <section className="min-w-2xs max-w-3xl w-full grid py-6 mx-auto bg-white dark:bg-customDarkFg rounded-md my-6">
        <div className="container border size-fit rounded-full mx-auto my-6">
          <AvatarIcon size="large" user={user} />
        </div>
        <div className="w-[90%] sm:w-[85%] flex flex-col gap-5 border-1 mx-auto mt-6 mb-10 py-6 px-6 sm:px-10 md:px-15 rounded-sm">
          <label>
            <span className="font-extrabold text-lg">Username</span>
            <input
              type="text"
              name="username"
              className="ring-1 p-2 w-full my-1.5 rounded-sm text-black dark:text-white"
              placeholder="Username"
              defaultValue={user.username}
            />
          </label>
          <label>
            <span className="font-extrabold text-lg">Full Name</span>
            <input
              type="text"
              name="fullName"
              className="ring-1 p-2 w-full my-1.5 rounded-sm text-black dark:text-white"
              placeholder="Username"
              defaultValue={user.fullName}
            />
            <span className="text-gray-500 dark:text-gray-400">
              Format: &lt;first name&gt; &lt;middle name&gt; &lt;last name&gt;
            </span>
            <span className="block leading-4 text-gray-500 dark:text-gray-400">
              E.g: Mayank Sachin Chougale
            </span>
          </label>
        </div>
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
