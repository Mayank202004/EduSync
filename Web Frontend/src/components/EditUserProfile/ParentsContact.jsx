import { useActionState, useState } from "react";
import toast from "react-hot-toast";

import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import SimpleButton from "@/components/ui/SimpleButton";
import ParentsContactTable from "./ParentsContactTable";

import { PARENT_RELATIONS } from "./value_maps/parentContantMaps";
import parentContactAction from "./form_actions/parentContactAction";

import { deleteParentContactApi } from "@/services/studentInfoService";

const ParentsContact = ({ initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [parentContact, formAction, isPending] = useActionState(
    (prevState, formData) => parentContactAction(prevState, formData, setInfo),
    {
      errors: null,
      inputValues: {
        name: "",
        phone: "",
        relation: "",
      },
    }
  );

  const deleteContact = async (contactId, parentName) => {
    try {
      toast.promise(deleteParentContactApi(contactId), {
        loading: `Deleting ${parentName} contact details...`,
        success: (response) => {
          setInfo(response.data);
          return "Deleted successfully"}
      })
    } catch(_) {
      //handled by axios interceptor
    }
  }

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <SelectOption
            key={parentContact.inputValues.relation}
            title="Relationship to student: "
            options={PARENT_RELATIONS}
            selectProps={{
              name: "relation",
              required: true,
              defaultValue: parentContact.inputValues.relation,
            }}
            selectStyle="border border-gray-300 dark:border-gray-600"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              key={parentContact.inputValues.name + "name-ParentsContact"}
              labelStyle="basis-3/5"
              titleText="Name"
              error={parentContact.errors?.get("name")}
              inputProps={{
                name: "name",
                defaultValue: parentContact.inputValues.name,
                required: true,
              }}
            />
            <Input
              key={parentContact.inputValues.phone + "phone-ParentsContact"}
              labelStyle="basis-2/5"
              titleText="Phone"
              error={parentContact.errors?.get("phone")}
              inputProps={{
                name: "phone",
                defaultValue: parentContact.inputValues.phone,
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
      {info?.length > 0 && <ParentsContactTable key={info} contacts={info} onDelete={deleteContact}/>}
    </>
  );
};

export default ParentsContact;
