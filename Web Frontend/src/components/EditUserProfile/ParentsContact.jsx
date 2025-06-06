import { useActionState, useState } from "react";

import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import SimpleButton from "@/components/ui/SimpleButton";
import ParentsContactTable from "./ParentsContactTable";

import { PARENT_RELATIONS } from "./value_maps/parentContantMaps";
import parentContactAction from "./form_actions/parentContactAction";

const ParentsContact = ({ initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [parentContact, formAction, isPending] = useActionState(
    (prevState, formData) => parentContactAction(prevState, formData, setInfo),
    {
      name: "",
      phone: "",
      relation: "",
    }
  );

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <SelectOption
            key={parentContact.relation}
            title="Relationship to student: "
            options={PARENT_RELATIONS}
            selectProps={{
              name: "relation",
              required: true,
              defaultValue: parentContact.relation,
            }}
            selectStyle="border border-gray-300 dark:border-gray-600"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              key={parentContact.name + "name-ParentsContact"}
              labelStyle="basis-3/5"
              titleText="Name"
              inputProps={{
                name: "name",
                defaultValue: parentContact.name,
                required: true,
              }}
            />
            <Input
              key={parentContact.phone + "phone-ParentsContact"}
              labelStyle="basis-2/5"
              titleText="Phone"
              inputProps={{
                name: "phone",
                defaultValue: parentContact.phone,
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
      {info?.length > 0 && <ParentsContactTable key={info} contacts={info} />}
    </>
  );
};

export default ParentsContact;
