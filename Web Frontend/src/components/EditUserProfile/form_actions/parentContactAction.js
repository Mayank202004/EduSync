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
    const errors = validateParentContact(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    toast.promise(addParentContactApi(values), {
      loading: "Adding...",
      success: (response) => {
        setInfo(response.data.parentContact);
        return "Contact added successfully";
      },
    });

    return { errors: null, inputValues: { name: "", phone: "", relation: "" } };
  } catch (err) {
    if (err?.message) toast.error(err.message); //for validation error

    return {
      errors: null,
      inputValues: values,
    };
  }
};

export default parentContactAction;
