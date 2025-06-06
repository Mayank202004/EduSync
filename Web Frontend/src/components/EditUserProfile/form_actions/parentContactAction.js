import toast from "react-hot-toast";

import { validateParentContact } from "../validators/parentContactValidation";
import { addParentContactApi } from "@/services/studentInfoService";

export const parentContactAction = async (prevState, formData, setInfo) => {
  const values = {
    name: formData.get("name")?.trim() || "",
    phone: formData.get("phone")?.trim() || "",
    relation: formData.get("relation")?.trim() || "",
  };

  try {
    validateParentContact(values);
    const response = await toast.promise(addParentContactApi(values), {
      loading: "Adding...",
      success: "Contact added successfully",
      error: "Something went wrong",
    });

    setInfo(response.data.parentContact);
    return { name: "", phone: "", relation: "" };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";

    toast.error(message);
    return values;
  }
};

export default parentContactAction;
