import { useActionState, useState } from "react";
import toast from "react-hot-toast";

import useExpandable from "@/hooks/useExpandable";

import Input from "@/components/ui/Input";
import SimpleButton from "@/components/ui/SimpleButton";
import OutlinedButton from "@/components/ui/OutlinedButton";
import SelectOption from "@/components/ui/SelectOption";
import Checkbox from "@/components/ui/CheckBox";
import SiblingsTable from "./SiblingTable";
import ExpandableDiv from "@/components/ui/ExpandableDiv";

import siblingInfoAction from "./form_actions/siblingInfoAction";
import {
  CLASSES,
  DIVISIONS,
  SIBLING_RELATIONS,
} from "./value_maps/siblingsInfoMaps";
import { deleteSiblingApi } from "@/services/studentInfoService";

const SiblingsInfo = ({ initialInfo }) => {
  const { height, setExpanded, containerRef, expanded } = useExpandable(false);
  const [info, setInfo] = useState(initialInfo);

  const deleteSibling = async (siblingId, siblingName) => {
    try {
      toast.promise(deleteSiblingApi(siblingId), {
        loading: `Deleting ${siblingName} details...`,
        success: (response) => {
          setInfo(response.data);
          return "Deleted successfully"}
      })
    } catch(_) {
      //handled by axios interceptor
    }
  }

  const [siblingInfo, formAction, isPending] = useActionState(
    (prevState, formData) => siblingInfoAction(prevState, formData, setInfo),
    {
      errors: null,
      inputValues: {
        relation: "Brother",
        name: "",
        age: 0,
        isInSameSchool: false,
        class: "Jr. KG",
        div: "A",
      },
    }
  );

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <SelectOption
            key={siblingInfo.inputValues.relation}
            title="Relationship to student: "
            options={SIBLING_RELATIONS}
            selectProps={{
              name: "relation",
              required: true,
              defaultValue: siblingInfo.inputValues.relation,
            }}
            selectStyle="border border-gray-300 dark:border-gray-600"
          />
          <hr />
          <div className="flex gap-4">
            <Input
              key={siblingInfo.inputValues.name}
              error={siblingInfo.errors?.get("name")}
              titleText="Name"
              inputProps={{
                name: "name",
                required: true,
                defaultValue: siblingInfo.inputValues.name,
              }}
              labelStyle="basis-3/4"
            ></Input>
            <Input
              key={siblingInfo.inputValues.age}
              error={siblingInfo.errors?.get("age")}
              titleText="Age"
              inputProps={{
                name: "age",
                required: true,
                type: "number",
                defaultValue: siblingInfo.inputValues.age,
              }}
              labelStyle="basis-1/4"
            ></Input>
          </div>
          <Checkbox
            key={expanded}
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
          <ExpandableDiv
            containerRef={containerRef}
            className="space-y-4"
            height={height}
          >
            <hr />
            <div className="flex flex-wrap gap-2 justify-around">
              <SelectOption
                key={siblingInfo.inputValues.class}
                title="Select Class"
                options={CLASSES}
                selectProps={{
                  name: "class",
                  required: true,
                  defaultValue: siblingInfo.inputValues.class,
                }}
                selectStyle="border border-gray-300 dark:border-gray-600"
              />
              <SelectOption
                key={siblingInfo.inputValues.div}
                title="Select Division"
                options={DIVISIONS}
                selectProps={{
                  name: "div",
                  required: true,
                  defaultValue: siblingInfo.inputValues.div,
                }}
                selectStyle="border border-gray-300 dark:border-gray-600"
              />
            </div>
          </ExpandableDiv>
        </div>
        <SimpleButton
          className={"disabled:opacity-60"}
          buttonProps={{ disabled: isPending }}
        >
          {isPending ? "Saving..." : "Save"}
        </SimpleButton>
      </form>
      {info?.length > 0 && <SiblingsTable key={info} info={info} onDelete={deleteSibling}/>}
    </>
  );
};

export default SiblingsInfo;
