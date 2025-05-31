import { useActionState } from "react";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import SimpleButton from "../ui/SimpleButton";
import { updateUserApi } from "@/services/profileService";

const FULLNAME_REGEX = /^[a-zA-Z\s]+$/;

const accountInfoAction = async (prevState, formData) => {
  const username = formData.get("username");
  const fullName = formData.get("fullName");

  if (!username?.trim() || !fullName?.trim()) {
    toast.error("Username and Full Name cannot be empty");
    return { username, fullName };
  }

  if (!FULLNAME_REGEX.test(fullName)) {
    toast.error("Full Name should contain alphabets and spaces only");
    return { username, fullName };
  }

  try {
    const apiCall = () => updateUserApi(username, fullName);

    const response = await toast.promise(apiCall(), {
      loading: "Updating account details...",
      success: "Profile updated successfully",
      error: "Failed to update profile",
    });

    if (response.statusCode < 200 || response.statusCode > 299) {
      toast.error(response.error || "Something went wrong while updating.");
      return { username, fullName };
    }

    // Reload only on success
    setTimeout(() => window.location.reload(), 200);
    return { username, fullName };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";

    toast.error(message);
    return { username, fullName };
  }
};

const EditAccountDetails = ({ accountInfo }) => {
  const [accountData, formAction, isPending] = useActionState(
    accountInfoAction,
    {
      username: accountInfo.username,
      fullName: accountInfo.fullName,
    }
  );

  return (
    <form className="space-y-6" action={formAction}>
      <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
        <Input
          titleText="Username"
          inputProps={{
            name: "username",
            type: "text",
            placeholder: "Username",
            required: true,
            defaultValue: accountData.username,
          }}
        />
        <Input
          titleText="Full Name"
          inputProps={{
            name: "fullName",
            type: "text",
            placeholder: "Full Name",
            required: true,
            defaultValue: accountData.fullName,
          }}
          hints={[
            "Format: <first name> <middle name> <last name>",
            "E.g: Mayank Sachin Chougale",
          ]}
        />
      </div>
      <SimpleButton buttonProps={{ type: "submit", disabled: isPending }}>
        {isPending ? "Saving..." : "Save"}
      </SimpleButton>
    </form>
  );
};

export default EditAccountDetails;
