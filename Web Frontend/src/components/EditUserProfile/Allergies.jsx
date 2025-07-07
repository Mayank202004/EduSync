import { useActionState, useState } from "react";
import toast from "react-hot-toast";

import Input from "@/components/Chat/Input";
import SimpleButton from "@/components/Chat/SimpleButton";
import AllergiesTable from "./AllergiesTable";

import allergyAction from "./form_actions/allergyAction";

import { deleteAllergyApi } from "@/services/studentInfoService";

const Allergies = ({ initialInfo }) => {
  const [info, setInfo] = useState(initialInfo);
  const [allergy, formAction, isPending] = useActionState(
    (prevState, formData) => allergyAction(prevState, formData, setInfo),
    {error: null, inputValue: ""}
  );

  const deleteAllergy = async (allergyName) => {
    try {
      toast.promise(deleteAllergyApi({allergyName}), {
        loading: `Deleting allergy ${allergyName}...`,
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
          <Input
            titleText="Allergy"
            error={allergy.error?.get("allergy")}
            inputProps={{ defaultValue: allergy.inputValue, name: "allergy" }}
          />
        </div>
        <SimpleButton
          className={"disabled:opacity-60"}
          buttonProps={{ disabled: isPending }}
        >
          {isPending ? "Saving..." : "Save"}
        </SimpleButton>
      </form>
      {info?.length > 0 && <AllergiesTable key={info} allergies={info} onDelete={deleteAllergy}/>}
    </>
  );
};

export default Allergies;
