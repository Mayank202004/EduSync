import { useActionState, useState } from "react";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import SelectOption from "../ui/SelectOption";
import SimpleButton from "../ui/SimpleButton";

import ParentsContactTable from "./ParentsContactTable";

import { PARENT_RELATIONS } from "./helpers/siblingsInfoMaps";
import { validateParentContact } from "./helpers/parentContactValidation";

import { addParentContactApi } from "@/services/studentInfoService";

const parentContactAction = async (prevState, formData, setInfo) => {
  const values = {
    name: formData.get("name")?.toString().trim() || "",
    phone: formData.get("phone") || "",
    relation: formData.get("relation")?.toString().trim() || "",
  };
  console.log(values);

  try {
    validateParentContact(values);
    const response = await toast.promise(addParentContactApi(values), {
      loading: "Adding...",
      success: "Contact added successfully",
      error: "Something went wrong",
    });
    console.log(response.data);
    setInfo(response.data.parentContact);
    return { name: "", phone: "", relation: "" };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
    return values;
  }
};

const ParentsContact = ({ initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [state, formAction, isPending] = useActionState(
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
            key={state.relation}
            title="Relationship to student: "
            options={PARENT_RELATIONS}
            selectProps={{
              name: "relation",
              required: true,
              defaultValue: state.relation,
            }}
            selectStyle="border border-gray-300 dark:border-gray-600"
          />
          <div className="flex gap-3">
            <Input
              key={state.name}
              labelStyle="basis-3/5"
              titleText="Name"
              inputProps={{
                name: "name",
                defaultValue: state.name,
                required: true,
              }}
            />
            <Input
              key={state.phone}
              labelStyle="basis-2/5"
              titleText="Phone"
              inputProps={{
                name: "phone",
                defaultValue: state.phone,
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
