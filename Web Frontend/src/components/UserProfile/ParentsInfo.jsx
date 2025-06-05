import { useActionState } from "react";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import SimpleButton from "../ui/SimpleButton";
import { validateParentInfoForm } from "./helpers/parentsDetailsValidation";

import { addParentDetailsApi } from "@/services/studentInfoService";

const parentInfoAction = async (prevState, formData) => {
  const values = {
    fatherName: formData.get("fathers-name")?.toString() ?? "",
    fatherOccupation: formData.get("fathers-occupation")?.toString() ?? "",
    fatherIncome: Number(formData.get("fathers-income") ?? 0),
    motherName: formData.get("mothers-name")?.toString() ?? "",
    motherOccupation: formData.get("mothers-occupation")?.toString() ?? "",
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

const ParentsInfo = ({ initialInfo }) => {
  const [state, formAction, isPending] = useActionState(parentInfoAction, {
    fatherName: initialInfo?.fatherName || "",
    fatherOccupation: initialInfo?.fatherOccupation || "",
    fatherIncome: initialInfo?.fatherIncome ?? 0,
    motherName: initialInfo?.motherName || "",
    motherOccupation: initialInfo?.motherOccupation || "",
    motherIncome: initialInfo?.motherIncome ?? 0,
  });

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
        <h2 className="font-bold text-lg">Father's Info</h2>
        <Input
          titleText="Name"
          inputProps={{ name: "fathers-name", defaultValue: state.fatherName }}
        />
        <div className="flex gap-3">
          <Input
            titleText="Occupation"
            labelStyle="basis-3/4"
            inputProps={{
              name: "fathers-occupation",
              defaultValue: state.fatherOccupation,
            }}
          />
          <Input
            titleText="Income(in &#x20B9;)"
            labelStyle="basis-1/4"
            inputProps={{
							type: "number",
              name: "fathers-income",
              defaultValue: state.fatherIncome,
            }}
          />
        </div>
        <hr />
        <h2 className="font-bold text-lg">Mother's Info</h2>
        <Input
          titleText="Name"
          inputProps={{ name: "mothers-name", defaultValue: state.motherName }}
        />
        <div className="flex gap-3">
          <Input
            titleText="Occupation"
            labelStyle="basis-3/4"
            inputProps={{
              name: "mothers-occupation",
              defaultValue: state.motherOccupation,
            }}
          />
          <Input
            titleText="Income(in &#x20B9;)"
            labelStyle="basis-1/4"
            inputProps={{
							type: "number",
              name: "mothers-income",
              defaultValue: state.motherIncome,
            }}
          />
        </div>
      </div>
      <SimpleButton
        className={"disabled:opacity-60"}
        buttonProps={{ disabled: isPending }}
      >
        {isPending ? "Saving..." : "Save"}
      </SimpleButton>
    </form>
  );
};

export default ParentsInfo;
