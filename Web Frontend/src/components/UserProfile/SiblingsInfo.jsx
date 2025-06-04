import { useActionState, useState } from "react";
import toast from "react-hot-toast";

import useExpandable from "@/hooks/useExpandable";

import Input from "@/components/ui/Input";
import SimpleButton from "../ui/SimpleButton";
import OutlinedButton from "../ui/OutlinedButton";
import SelectOption from "../ui/SelectOption";
import Checkbox from "../ui/CheckBox";
import SiblingsTable from "./SiblingTable";

import {
  CLASSES,
  DIVISIONS,
  SIBLING_RELATIONS,
} from "./helpers/siblingsInfoMaps";
import validateSiblingForm from "./helpers/siblingValidation";

import { addSiblingInfoApi } from "@/services/studentInfoService";

const siblingFormAction = async (prevState, formData, setInfo) => {
  const values = {
    relation: formData.get("relation") || "Brother",
    name: formData.get("name") || "",
    age: Number(formData.get("age") || 1),
    isInSameSchool: formData.get("isInSameSchool") === "on",
    class: formData.get("class") || "Jr. KG",
    div: formData.get("div") || "A",
  };

  try {
    validateSiblingForm(values);

    const apiCall = () => addSiblingInfoApi(values);
    const response = await toast.promise(apiCall, {
      loading: "Saving...",
      success: "Sibling information saved successfully!",
      error: "Failed to save sibling information.",
    });

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(response.error || "Something went wrong while updating.");
    }

    setInfo(response.student.siblingInfo);
    return {
      relation: "Brother",
      name: "",
      age: 1,
      isInSameSchool: false,
      class: "Jr. KG",
      div: "A",
    };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "An unknown error occurred while updating your profile.";
    toast.error(message);
    return values;
  }
};

const SiblingsInfo = ({ initialInfo }) => {
  const { height, setExpanded, containerRef, expanded } = useExpandable(false);
  const [info, setInfo] = useState(initialInfo);

  const [formValues, formAction, isPending] = useActionState(
    (prevState, formData) => siblingFormAction(prevState, formData, setInfo),
    {
      relation: "Brother",
      name: "",
      age: 1,
      isInSameSchool: false,
      class: "Jr. KG",
      div: "A",
    }
  );

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <SelectOption
            title="Relationship to student: "
            options={SIBLING_RELATIONS}
            selectProps={{
              name: "relation",
              required: true,
              defaultValue: formValues.relation,
            }}
            selectStyle="border border-gray-300 dark:border-gray-600"
          />
          <hr />
          <div className="flex gap-4">
            <Input
              titleText="Name"
              inputProps={{
                name: "name",
                required: true,
                defaultValue: formValues.name,
              }}
              labelStyle="basis-3/4"
            ></Input>
            <Input
              titleText="Age"
              inputProps={{
                name: "age",
                required: true,
                type: "number",
                defaultValue: formValues.age,
              }}
              labelStyle="basis-1/4"
            ></Input>
          </div>
          <Checkbox
            label="Is the sibling currently studying in this school?"
            inputProps={{
              value: "on",
              name: "isInSameSchool",
              checked: expanded,
              onChange: (e) => {
                setExpanded(e.target.checked);
              },
            }}
          />
          <div
            ref={containerRef}
            className="space-y-4"
            style={{
              maxHeight: `${height}px`,
              transition: "max-height 0.3s ease",
              overflow: "hidden",
            }}
          >
            <hr />
            <div className="flex flex-wrap gap-2 justify-around">
              <SelectOption
                title="Select Class"
                options={CLASSES}
                selectProps={{
                  name: "class",
                  required: true,
                  defaultValue: formValues.class,
                }}
                selectStyle="border border-gray-300 dark:border-gray-600"
              />
              <SelectOption
                title="Select Division"
                options={DIVISIONS}
                selectProps={{
                  name: "div",
                  required: true,
                  defaultValue: formValues.div,
                }}
                selectStyle="border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
        <SimpleButton
          className={"disabled:opacity-60"}
          buttonProps={{ disabled: isPending }}
        >
          {isPending ? "Saving..." : "Save"}
        </SimpleButton>
      </form>
      {info?.length > 0 && <SiblingsTable key={info} info={info} />}
    </>
  );
};

export default SiblingsInfo;
