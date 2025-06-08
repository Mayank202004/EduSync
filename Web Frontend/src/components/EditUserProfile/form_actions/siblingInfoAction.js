import toast from "react-hot-toast";

import { validateSiblingForm } from "../validators/siblingValidation";
import { addSiblingInfoApi } from "@/services/studentInfoService";

const siblingInfoAction = async (prevState, formData, setInfo) => {
  const values = {
    relation: formData.get("relation")?.trim() || "Brother",
    name: formData.get("name")?.trim() || "",
    age: Number(formData.get("age") || 0),
    isInSameSchool: formData.get("isInSameSchool")?.trim() === "on",
    class: formData.get("class")?.trim() || "Jr. KG",
    div: formData.get("div")?.trim() || "A",
  };

  try {
    const errors = validateSiblingForm(values);
    if (errors.size !== 0) return {errors, inputValues: values}

    const response = await toast.promise(addSiblingInfoApi(values), {
      loading: "Saving...",
      success: "Sibling information saved successfully!",
      error: "Failed to save sibling information.",
    });

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(response.error || "Something went wrong while updating.");
    }

    setInfo(response.student.siblingInfo);
    return {errors: null, inputValues: {
      errors: null,
      inputValues: {
        relation: "Brother",
        name: "",
        age: 1,
        isInSameSchool: false,
        class: "Jr. KG",
        div: "A",
      }},
    };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
    return {errors: null, inputValues: values};
  }
};

export default siblingInfoAction;
