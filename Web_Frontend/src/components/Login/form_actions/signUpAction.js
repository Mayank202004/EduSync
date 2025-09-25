import toast from "react-hot-toast";

import { validateSignUp } from "../validators/signUpValidation";
import { ROLES_MAP } from "../value_maps/signupMaps";
import { signupApi } from "@/services/authService";

const signUpAction = async (prevState, formData, onSuccess) => {
  const role = formData.get("role")?.trim() || "";

  const values = {
    email: formData.get("email")?.trim() || "",
    username: formData.get("username")?.trim() || "",
    fullName: formData.get("fullName")?.trim() || "",
    role: role,
    password: formData.get("password")?.trim() || "",
    class: role === "student" ? formData.get("class")?.trim() || "" : "",
    schoolId: formData.get("schoolId")?.trim() || "",
  };

  try {
    const errors = validateSignUp(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    await toast.promise(signupApi(values), {
      loading: "Creating Account...",
      success: () => {
        onSuccess(); // Swap signup card to login card
        return "Account Created! Proceed to login.";
      },
    });
  } catch (err) {
    // Handled by axiosInstance
  }

  return { errors: null, inputValues: values };
};

export default signUpAction;
