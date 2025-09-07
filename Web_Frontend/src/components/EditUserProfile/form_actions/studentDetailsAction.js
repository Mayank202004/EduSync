import toast from "react-hot-toast";
import { validateStudentDetails } from "../validators/studentDetailsValidation";
import { addStudentDetails } from "@/services/studentInfoService";

const studentDetailsAction = async (_, formData) => {
  const values = {
    address: formData.get("address") || "",
    bloodGroup: formData.get("bloodGroup") || "",
    dob: formData.get("dob") || "",
  };

  try {
    const errors = validateStudentDetails(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    toast.promise(addStudentDetails(values), {
      loading: "Updating...",
      success: (_) => {
        return "Student details saved successfully";
      },
    });

    return {
      errors: null,
      inputValues: values,
    };
  } catch (err) {
    if (err?.message) toast.error(err.message); //for validation error

    return {
      errors: null,
      inputValues: values,
    };
  }
};

export default studentDetailsAction;