import { useActionState } from "react";

import Input from "@/components/ui/Input";
import SimpleButton from "@/components/ui/SimpleButton";

import parentInfoAction from "./form_actions/parentInfoAction";

const ParentsInfo = ({ initialInfo }) => {
  const [parentInfo, formAction, isPending] = useActionState(parentInfoAction, {
    errors: null,
    inputValues: {
      fatherName: initialInfo?.fatherName || "",
      fatherOccupation: initialInfo?.fatherOccupation || "",
      fatherIncome: initialInfo?.fatherIncome ?? 0,
      motherName: initialInfo?.motherName || "",
      motherOccupation: initialInfo?.motherOccupation || "",
      motherIncome: initialInfo?.motherIncome ?? 0,
    },
  });

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
        <h2 className="font-bold text-lg">Father's Info</h2>
        <Input
          titleText="Name"
          error={parentInfo.errors?.get("fathers-name")}
          inputProps={{ name: "fathers-name", defaultValue: parentInfo.inputValues.fatherName }}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            titleText="Occupation"
            labelStyle="basis-3/4"
            error={parentInfo.errors?.get("fathers-occupation")}
            inputProps={{
              name: "fathers-occupation",
              defaultValue: parentInfo.inputValues.fatherOccupation,
              required: true,
            }}
          />
          <Input
            titleText="Income(in &#x20B9;)"
            labelStyle="basis-1/4"
            error={parentInfo.errors?.get("fathers-income")}
            inputProps={{
              type: "number",
              name: "fathers-income",
              defaultValue: parentInfo.inputValues.fatherIncome,
              required: true,
            }}
          />
        </div>
        <hr />
        <h2 className="font-bold text-lg">Mother's Info</h2>
        <Input
          titleText="Name"
          error={parentInfo.errors?.get("mothers-name")}
          inputProps={{
            name: "mothers-name",
            defaultValue: parentInfo.inputValues.motherName,
            required: true,
          }}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            titleText="Occupation"
            labelStyle="basis-3/4"
            error={parentInfo.errors?.get("mothers-occupation")}
            inputProps={{
              name: "mothers-occupation",
              defaultValue: parentInfo.inputValues.motherOccupation,
              required: true,
            }}
          />
          <Input
            titleText="Income(in &#x20B9;)"
            labelStyle="basis-1/4"
            error={parentInfo.errors?.get("mothers-income")}
            inputProps={{
              type: "number",
              name: "mothers-income",
              defaultValue: parentInfo.inputValues.motherIncome,
              required: true,
            }}
          />
        </div>
      </div>
      <SimpleButton
        className={"disabled:opacity-60"}
        buttonProps={{ disabled: isPending }}
      >
        {isPending ? "Saving..." : "Save Changes"}
      </SimpleButton>
    </form>
  );
};

export default ParentsInfo;
