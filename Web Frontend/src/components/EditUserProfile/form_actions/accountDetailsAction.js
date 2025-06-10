import toast from "react-hot-toast";

import { updateUserApi } from "@/services/profileService";
import { validateAccountDetails } from "../validators/accountDetailsValidation";

const accountDetailsAction = async (prevState, formData) => {
  const values = {
    username: formData.get("username")?.trim() || "",
    fullName: formData.get("fullName")?.trim() || "",
  };

  try {
    const errors = validateAccountDetails(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    toast.promise(updateUserApi(values), {
      loading: "Updating account details...",
      success: (_) => {
        setTimeout(() => window.location.reload(), 200);
        return "Profile updated successfully";
      },
    });

    return { errors: null, inputValues: values };
  } catch (_) {
    //alrady handled by axios interceptor
  }
};

export default accountDetailsAction;
