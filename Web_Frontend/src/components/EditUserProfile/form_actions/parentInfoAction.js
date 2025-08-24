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
    const errors = validateParentInfoForm(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    toast.promise(addParentDetailsApi(values), {
      loading: "Updating...",
      success: (_) => {
        return "Parent details saved successfully"
      },
    });

    return { errors: null, inputValues: values };
  } catch (_) {
    //already handled by axios interceptor
  }
};

export default parentInfoAction;
