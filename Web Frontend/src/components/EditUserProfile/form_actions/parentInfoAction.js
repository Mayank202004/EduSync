import toast from "react-hot-toast";

import { validateParentInfoForm } from "../validators/parentsDetailsValidation";
import { addParentDetailsApi } from "@/services/studentInfoService";

const parentInfoAction = async (prevState, formData) => {
  const values = {
    fatherName: formData.get("fathers-name")?.trim() || "",
    fatherOccupation: formData.get("fathers-occupation")?.trim() || "",
    fatherIncome: Number(formData.get("fathers-income") ?? 0),
    motherName: formData.get("mothers-name")?.trim() || "",
    motherOccupation: formData.get("mothers-occupation")?.trim() || "",
    motherIncome: Number(formData.get("mothers-income") ?? 0),
  };

  try {
    validateParentInfoForm(values);
    toast.promise(addParentDetailsApi(values), {
      loading: "Updating...",
      success: "Parent details saved successfully",
      error: "Something went wrong",
    });
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
  }
  return values;
};

export default parentInfoAction;
