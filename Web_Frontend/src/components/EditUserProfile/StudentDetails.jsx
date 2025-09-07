import { useActionState } from "react";

import Input from "@/components/UI/Input";
import SimpleButton from "@/components/UI/SimpleButton";
import SelectOption from "../Chat/SelectOption";

import { formatToYYYYMM_D } from "@/utils/dateUtils";
import { BLOOD_GROUPS } from "./value_maps/studentDetailsMap";
import studentDetailsAction from "./form_actions/studentDetailsAction";

const StudentDetails = ({ initialInfo }) => {
  const [studentDetails, formAction, isPending] = useActionState(
    studentDetailsAction,
    {
      errors: null,
      inputValues: {
        address: initialInfo?.address || "",
        bloodGroup: initialInfo?.bloodGroup || BLOOD_GROUPS[0].value,
        dob: initialInfo?.dob || "",
      },
    }
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            titleText="Date of Birth"
            labelStyle="basis-4/5"
            error={studentDetails.errors?.get("dob")}
            inputProps={{
              type: "date",
              name: "dob",
              defaultValue: formatToYYYYMM_D(studentDetails.inputValues.dob),
            }}
          />
          <SelectOption
            key={studentDetails.inputValues.bloodGroup}
            title="Blood Group"
            options={BLOOD_GROUPS}
            containerStyle="basis-1/5 flex-col gap-1 items-start"
            selectProps={{
              name: "bloodGroup",
              defaultValue: studentDetails.inputValues.bloodGroup,
            }}
            selectStyle="border border-gray-300 w-full dark:border-gray-600"
          />
        </div>
        <Input
          titleText="Address"
          error={studentDetails.errors?.get("address")}
          inputProps={{
            name: "address",
            defaultValue: studentDetails.inputValues.address,
          }}
        />
      </div>
      <SimpleButton
        className={"disabled:opacity-60"}
        buttonProps={{ disabled: isPending, type: "submit" }}
      >
        {isPending ? "Saving..." : "Save Changes"}
      </SimpleButton>
    </form>
  );
};

export default StudentDetails;
