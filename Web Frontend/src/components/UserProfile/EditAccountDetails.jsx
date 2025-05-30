const EditAccountDetails = ({ user }) => {
  return (
    <div className="w-[90%] sm:w-[85%] flex flex-col gap-5 border-1 mx-auto mb-10 py-6 px-6 sm:px-10 md:px-15 rounded-sm">
      <label>
        <span className="font-bold text-lg">Username</span>
        <input
          type="text"
          name="username"
          className="ring-1 p-2 w-full my-1.5 rounded-sm text-black dark:text-white"
          placeholder="Username"
          defaultValue={user?.username}
          required
        />
      </label>
      <label>
        <span className="font-bold text-lg">Full Name</span>
        <input
          type="text"
          name="fullName"
          className="ring-1 p-2 w-full my-1.5 rounded-sm text-black dark:text-white"
          placeholder="Full name"
          defaultValue={user?.fullName}
          required
        />
        <span className="text-gray-500 dark:text-gray-400">
          Format: &lt;first name&gt; &lt;middle name&gt; &lt;last name&gt;
        </span>
        <span className="block leading-4 text-gray-500 dark:text-gray-400">
          E.g: Mayank Sachin Chougale
        </span>
      </label>
    </div>
  );
};

export default EditAccountDetails;
