import { useAuth } from "@/auth/AuthContext";
import AvatarIcon from "@/components/Topbar/AvatarIcon";
import { capitalizeFirstLetter } from "@/lib/utils";
import EditAccountDetails from "@/components/UserProfile/EditAccountDetails";
import PhotoPreview from "@/components/UserProfile/PhotoPreview";
import TitledContainer from "@/components/ui/TitledContainer";

const UserProfile = () => {
  const { user } = useAuth();
  // const [blob, setBlob] = useState(null);
  // const [profileData, formAction, isPending] = useActionState(
  //   async (prevState, formData) => {
  //     const username = formData.get("username");
  //     const fullName = formData.get("fullName");

  //     if (!username?.trim() || !fullName?.trim()) {
  //       toast.error("Username and Full Name cannot be empty");
  //       return prevState;
  //     }

  //     if (!FULLNAME_REGEX.test(fullName)) {
  //       toast.error("Username should have alphabets and spaces only");
  //       return prevState;
  //     }

  //     try {
  //       const tempFormData = new FormData();
  //       if (blob) {
  //         //compress if new image was selected
  //         const compressedBlob = await compressImage(blob);
  //         tempFormData.append("avatar", compressedBlob);
  //       }

  //       const apiCall = async () => {
  //         return await updateUserApi(
  //           username,
  //           fullName,
  //           blob ? tempFormData : null
  //         );
  //       };

  //       const { userDataRes, avatarDataRes } = await toast.promise(apiCall, {
  //         loading: "Updating profile...",
  //         success: "Profile updated successfully",
  //         error: "Failed to update profile",
  //       });

  //       // If backend sends a specific error inside the response (e.g. validation fail)
  //       if (userDataRes?.data?.error || avatarDataRes?.data?.error) {
  //         toast.error(
  //           userDataRes?.data?.error ||
  //             avatarDataRes?.data?.error ||
  //             "Something went wrong"
  //         );
  //         return { ...prevState, username, fullName };
  //       }

  //       // All went fine — refresh page or update UI
  //       setTimeout(() => window.location.reload(), 200);
  //       return { username, fullName };
  //     } catch (err) {
  //       const message =
  //         err.response?.data?.message ||
  //         err.message ||
  //         "Unknown error occurred";
  //       toast.error(message);
  //       return { ...prevState, username, fullName };
  //     }
  //   },
  //   {
  //     username: user.username,
  //     fullName: user.fullName,
  //     avatar: user.avatar,
  //   }
  // );

  // const handleBlob = (blobData) => {
  //   setBlob(blobData);
  // };


  return (
    <div className="flex flex-col min-h-full w-full bg-customLightBg dark:bg-customDarkBg">
      <h1 className="font-bold text-4xl w-fit mx-auto mt-10">Edit Profile</h1>
      <h3 className="mx-auto text-lg text-gray-400">
        {capitalizeFirstLetter(user.role)}
      </h3>
      <div className="min-w-2xs max-w-3xl w-full flex flex-col gap-6 items-center mx-auto rounded-md my-6">
        {/* <TitledContainer title="Photo Preview" containerStyle="px-2 sm:px-6">
          <PhotoPreview user={profileData} onBlobReady={handleBlob} />
        </TitledContainer> */}
        <TitledContainer title="Account details">
          <EditAccountDetails accountInfo={user} />
        </TitledContainer>
      </div>
    </div>
  );
};

export default UserProfile;
