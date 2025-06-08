import toast from "react-hot-toast";

import { validateAllergy } from "../validators/allergyValidation";
import { addAllergyApi } from "@/services/studentInfoService";

const allergyAction = async (prevState, formData, setInfo) => {
  const values = { allergy: formData.get("allergy")?.trim() || "" };

  try {
    const error = validateAllergy(values);
    if (error.size !== 0) return { error, inputValues: values.allergy };

    const response = await toast.promise(addAllergyApi(values), {
      loading: "Updating...",
      success: "Allergy added successfully",
      error: "Something went wrong",
    });
    setInfo(response.data.allergies);
    return {error: null, inputValues: ""};
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
    return { error: null, inputValues: values.allergy };
  }
};

export default allergyAction;
