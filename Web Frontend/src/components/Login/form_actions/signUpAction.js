import toast from "react-hot-toast";

import { validateSignUp } from "../validators/signUpValidation";
import { ROLES_MAP } from "../value_maps/signupMaps";
import { signupApi } from "@/services/authService";

const signUpAction = async (prevState, formData, onSuccess) => {
  const values = {
    email: formData.get("email")?.trim() || "",
    username: formData.get("username")?.trim() || "",
    fullName: formData.get("fullName")?.trim() || "",
    role: formData.get("role")?.trim() || "",
    password: formData.get("password")?.trim() || "",
  };

  try {
    const errors = validateSignUp(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    const response = await toast.promise(signupApi(values), {
      loading: "Creating Account...",
      success: "Account Created! Proceed to login.",
    });

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(response.error || "Something went wrong while updating.");
    }

    onSuccess(); // Swap signupcard to loginCard
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
  }
  return { errors: null, inputValues: values };
};

export default signUpAction;
