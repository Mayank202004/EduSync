import toast from "react-hot-toast";

import { validateChangePassword } from "../validators/changePasswordValidation";
import { changePasswordApi } from "@/services/profileService";

const changePasswordAction = async (_, formData) => {
  const values = {
    oldPassword: formData.get("oldPassword")?.trim() || "",
    newPassword: formData.get("newPassword")?.trim() || "",
    confirmPassword: formData.get("confirmPassword")?.trim() || "",
  };

  try {
    const errors = validateChangePassword(values);
    if (errors.size) return { errors, inputValues: values };

    toast.promise(changePasswordApi(values), {
      loading: "Updating...",
      success: (_) => {
        return "Password updated successfully";
      },
    });

    return { errors: null, inputValues: "" };
  } catch (_) {
    //already handled by axios interceptor
  }

  return {
    errors: null,
    inputValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  };
};

export default changePasswordAction;
