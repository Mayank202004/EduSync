import { useActionState, useState } from "react";

import useExpandable from "@/hooks/useExpandable";

import Input from "@/components/ui/Input";
import SimpleButton from "@/components/ui/SimpleButton";
import OutlinedButton from "@/components/ui/OutlinedButton";
import SelectOption from "@/components/ui/SelectOption";
import Checkbox from "@/components/ui/CheckBox";
import SiblingsTable from "./SiblingTable";

import siblingInfoAction from "./form_actions/siblingInfoAction";
import {
  CLASSES,
  DIVISIONS,
  SIBLING_RELATIONS,
} from "./value_maps/siblingsInfoMaps";

const SiblingsInfo = ({ initialInfo }) => {
  const { height, setExpanded, containerRef, expanded } = useExpandable(false);
  const [info, setInfo] = useState(initialInfo);

  const [formValues, formAction, isPending] = useActionState(
    (prevState, formData) => siblingInfoAction(prevState, formData, setInfo),
    {
      relation: "Brother",
      name: "",
      age: 0,
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
            key={formValues.relation}
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
              key={formValues.name}
              titleText="Name"
              inputProps={{
                name: "name",
                required: true,
                defaultValue: formValues.name,
              }}
              labelStyle="basis-3/4"
            ></Input>
            <Input
              key={formValues.age}
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
                key={formValues.class}
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
                key={formValues.div}
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
