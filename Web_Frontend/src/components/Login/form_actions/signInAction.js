import toast from "react-hot-toast";
import { validateSignIn } from "../validators/signInValidation";
import { loginApi } from "@/services/authService";

const signInAction = async (prevState, formData, onSuccess, onOtpRequired) => {
  const values = {
    identifier: formData.get("identifier")?.trim() || "",
    password: formData.get("password")?.trim() || "",
  };

  const errors = validateSignIn(values);
  if (errors.size !== 0) return { errors, inputValues: values };

  try {
    const response = await loginApi(values);

    if (response.data.otpRequired) {
      onOtpRequired(response.data.otpData);
      return { errors: null, inputValues: values };
    }

    onSuccess(response.data);
    toast.success(`Welcome, ${response.data.user.username || "User"}!`);
    return { errors: null, inputValues: values };

  } catch (err) {
    return { errors: null, inputValues: values };
  }
};


export default signInAction;
