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

    await toast.promise(signupApi(values), {
      loading: "Creating Account...",
      success: () => {
        onSuccess(); // Swap signupcard to loginCard
        return "Account Created! Proceed to login.";
      },
    });
  } catch (err) {
    if (err?.message) toast.error("Login failed. Please try again.");
  }
  return { errors: null, inputValues: values };
};

export default signUpAction;
