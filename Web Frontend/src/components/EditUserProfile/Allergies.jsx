import { useActionState, useState } from "react";

import Input from "@/components/ui/Input";
import SimpleButton from "@/components/ui/SimpleButton";
import AllergiesTable from "./AllergiesTable";

import allergyAction from "./form_actions/allergyAction";

const Allergies = ({ initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [allergy, formAction, isPending] = useActionState(
    (prevState, formData) => allergyAction(prevState, formData, setInfo),
    ""
  );

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <Input
            titleText="Allergy"
            inputProps={{ defaultValue: allergy, name: "allergy" }}
          />
        </div>
        <SimpleButton
          className={"disabled:opacity-60"}
          buttonProps={{ disabled: isPending }}
        >
          {isPending ? "Saving..." : "Save"}
        </SimpleButton>
      </form>
      {info?.length > 0 && <AllergiesTable key={info} allergies={info} />}
    </>
  );
};

export default Allergies;
