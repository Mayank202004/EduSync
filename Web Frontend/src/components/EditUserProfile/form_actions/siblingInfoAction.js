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
    if (errors.size !== 0) return { errors, inputValues: values };

    toast.promise(addSiblingInfoApi(values), {
      loading: "Saving...",
      success: (response) => {
        setInfo(response.student.siblingInfo);
        return "Sibling information saved successfully!";
      },
    });

    return {
      errors: null,
      inputValues: {
        errors: null,
        inputValues: {
          relation: "Brother",
          name: "",
          age: 1,
          isInSameSchool: false,
          class: "Jr. KG",
          div: "A",
        },
      },
    };
  } catch (err) {
    if (err?.message) toast.error(err.message);  //for validation error

    return {
      errors: null,
      inputValues: values,
    };
  }
};

export default siblingInfoAction;
