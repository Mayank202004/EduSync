import toast from "react-hot-toast";
import { validateSignIn } from "../validators/signInValidation";
import { loginApi } from "@/services/authService";

const signInAction = async (prevState, formData, onSuccess) => {
  const values = {
    identifier: formData.get("identifier")?.trim() || "",
    password: formData.get("password")?.trim() || "",
  };

  const errors = validateSignIn(values);
  if (errors.size !== 0) return { errors, inputValues: values };

  const loginPromise = loginApi(values);

  // Toast based on promise state
  try {
    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: (response) => {
        onSuccess(response.data);
        return `Welcome, ${response.data.user.username || "User"}!`;
      },
    });
    return { errors: null, inputValues: values };
  } catch (err) {
    if (err?.message) toast.error("Login failed. Please try again.");

    return {
      errors: null,
      inputValues: values,
    };
  }
};

export default signInAction;
