import toast from "react-hot-toast";

import { validateAllergy } from "../validators/allergyValidation";
import { addAllergyApi } from "@/services/studentInfoService";

const allergyAction = async (prevState, formData, setInfo) => {
  const values = { allergy: formData.get("allergy")?.trim() || "" };

  try {
    const error = validateAllergy(values);
    if (error.size !== 0) return { error, inputValues: values.allergy };

    toast.promise(addAllergyApi(values), {
      loading: "Updating...",
      success: (response) => {
        setInfo(response.data.allergies);
        return "Allergies updated successfully";
      },
    });
    return { error: null, inputValues: "" };
  } catch (_) {
    //already handled by axios interceptor
  }
};

export default allergyAction;
