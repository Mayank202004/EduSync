import AvatarIcon from "@/components/Topbar/AvatarIcon";
import EditAccountDetails from "@/components/UserProfile/EditAccountDetails";
import PhotoPreview from "@/components/UserProfile/PhotoPreview";
import TitledContainer from "@/components/ui/TitledContainer";

import { useAuth } from "@/auth/AuthContext";
import { capitalizeFirstLetter } from "@/lib/utils";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-full w-full bg-customLightBg dark:bg-customDarkBg">
      <h1 className="font-bold text-4xl w-fit mx-auto mt-10">Edit Profile</h1>
      <h3 className="mx-auto text-lg text-gray-400">
        {capitalizeFirstLetter(user.role)}
      </h3>
      <div className="min-w-2xs max-w-3xl w-full flex flex-col gap-6 items-center mx-auto rounded-md my-6">
        <TitledContainer title="Photo Preview" containerStyle="px-2 sm:px-6">
          <PhotoPreview avatar={user.avatar} />
        </TitledContainer>
        <TitledContainer title="Account details">
          <EditAccountDetails
            accountInfo={{ fullName: user.fullName, username: user.username }}
          />
        </TitledContainer>
      </div>
    </div>
  );
};

export default UserProfile;
