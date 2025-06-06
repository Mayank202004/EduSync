import toast from "react-hot-toast";

import { validateAllergy } from "../validators/allergyValidation";
import { addAllergyApi } from "@/services/studentInfoService";

const allergyAction = async (prevState, formData, setInfo) => {
  const values = { allergy: formData.get("allergy")?.trim() || "" };

  try {
    validateAllergy(values);
    const response = await toast.promise(addAllergyApi(values), {
      loading: "Updating...",
      success: "Allergy added successfully",
      error: "Something went wrong",
    });
    setInfo(response.data.allergies);
    return "";
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
  }
  return values.allergy;
};

export default allergyAction;
