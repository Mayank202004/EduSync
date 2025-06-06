import toast from "react-hot-toast";

import { updateUserApi } from "@/services/profileService";
import validateAccountDetails from "../validators/accountDetailsValidation";

const accountDetailsAction = async (prevState, formData) => {
  const values = {
    username: formData.get("username")?.trim() || "",
    fullName: formData.get("fullName")?.trim() || "",
  };

  try {
    validateAccountDetails(values);
    const response = await toast.promise(updateUserApi(values), {
      loading: "Updating account details...",
      success: "Profile updated successfully",
      error: "Failed to update profile",
    });

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(response.error || "Something went wrong while updating.");
    }
    // Reload only on success
    setTimeout(() => window.location.reload(), 200);
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";

    toast.error(message);
  }
  return values;
};

export default accountDetailsAction;
