import { useActionState } from "react";

import Input from "@/components/ui/Input";
import SimpleButton from "@/components/ui/SimpleButton";

import parentInfoAction from "./form_actions/parentInfoAction";

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
              required: true,
            }}
          />
          <Input
            titleText="Income(in &#x20B9;)"
            labelStyle="basis-1/4"
            inputProps={{
              type: "number",
              name: "fathers-income",
              defaultValue: state.fatherIncome,
              required: true,
            }}
          />
        </div>
        <hr />
        <h2 className="font-bold text-lg">Mother's Info</h2>
        <Input
          titleText="Name"
          inputProps={{
            name: "mothers-name",
            defaultValue: state.motherName,
            required: true,
          }}
        />
        <div className="flex gap-3">
          <Input
            titleText="Occupation"
            labelStyle="basis-3/4"
            inputProps={{
              name: "mothers-occupation",
              defaultValue: state.motherOccupation,
              required: true,
            }}
          />
          <Input
            titleText="Income(in &#x20B9;)"
            labelStyle="basis-1/4"
            inputProps={{
              type: "number",
              name: "mothers-income",
              defaultValue: state.motherIncome,
              required: true,
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
