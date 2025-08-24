import toast from "react-hot-toast";
import { validateNewFee } from "../validators/newFeeValidation";

export const newFeeAction = (prevState, formData) => {
  const values = {
    title: formData.get("title")?.trim() || "",
    amount: parseFloat(formData.get("amount")) || 0,
    dueDate: formData.get("dueDate")?.trim() || "",
    feeType: formData.get("feeType")?.trim() || "",
    discount: parseFloat(formData.get("discount")) || 0,
    compulsory: formData.get("compulsory") === "compulsary",
    addToAll: formData.get("addToAll") === "addtoAll",
    className: formData.get("className")?.trim() || "",
  };

  try {
    const errors = validateNewFee(values);
      if (errors.size !== 0) {
        console.log("here", errors)
        return { errors, inputValues: values }};
    
    toast.success("Form validated")
    return {
      errors: null,
      inputValues: values
    }
  } catch (err) {
    if (err?.message) toast.error("Login failed. Please try again.");

    return {
      errors: null,
      inputValues: values,
    };
  }
};
