import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

import useExpandable from "@/hooks/useExpandable";

import Input from "@/components/ui/Input";
import SimpleButton from "../ui/SimpleButton";
import OutlinedButton from "../ui/OutlinedButton";
import SelectOption from "../ui/SelectOption";
import Checkbox from "../ui/CheckBox";

import { CLASSES, DIVISIONS, SIBLING_RELATIONS } from "./siblingsInfoMaps";
import validateSiblingForm from "./helpers/siblingValidation";

import {
  getStudentInfo,
  addSiblingInfoApi,
} from "@/services/studentInfoService";

const SiblingsInfo = () => {
  // activeSibling is the current index of sibling selected by user in the info received from api
  // -1 represents new sibling is being added
  const [activeSibling, setActiveSibling] = useState(-1);
  const { height, setExpanded, containerRef, expanded } = useExpandable(false);
  const [info, setInfo] = useState([]);

  //form values are tracked using this state and form is updated using formaction
  const [formValues, setFormValues] = useState({
    relation: "Brother",
    name: "",
    age: 1,
    isInSameSchool: false,
    class: "Jr. KG",
    div: "A",
  });

  const [_, formAction, isPending] = useActionState(
    async (prevState, formData) => {
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

        const apiCall = () => addSiblingInfoApi(values)
        const response = await toast.promise(apiCall, {
          loading: "Saving...",
          success: "Sibling information saved successfully!",
          error: "Failed to save sibling information.",
        });

        if (response.statusCode < 200 || response.statusCode > 299) {
          throw new Error(
            response.error || "Something went wrong while updating."
          );
        }

        setInfo(response.student.siblingInfo)
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "An unknown error occurred while updating your profile.";
        toast.error(message);
      } finally {
        setFormValues(values);
      }
    },
    {}
  );

  useEffect(() => {
    (async () => {
      const response = await getStudentInfo();
      const siblings = response.data.siblingInfo || [];

      setInfo(siblings);
      const hasSiblings = siblings.length > 0;
      setActiveSibling(hasSiblings ? 0 : -1);
    })();
  }, []);

  useEffect(() => {
    if (activeSibling >= 0 && info.length > 0) {
      const sibling = info[activeSibling];
      setFormValues({
        relation: sibling.relation,
        name: sibling.name,
        age: sibling.age,
        isInSameSchool: sibling.isInSameSchool,
        class: sibling.class,
        div: sibling.div,
      });
    } else if (activeSibling === -1) {
      // Add new sibling case
      setFormValues({
        relation: "Brother",
        name: "",
        age: 1,
        isInSameSchool: false,
        class: "Jr. KG",
        div: "A",
      });
    }
  }, [activeSibling, info]);

  useEffect(() => {
    setExpanded(
      activeSibling >= 0 ? info[activeSibling]?.isInSameSchool : false
    );
  }, [activeSibling, info, setExpanded]);

  return (
    //setting keys as formValues is important to update those fields during re-renders
    <>
      {info.length > 0 && (
        <div className="container flex flex-nowrap items-center gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1 justify-center w-fit text-sm">
            {info.map((sibling, index) => (
              <>
                <OutlinedButton
                  variant="custom"
                  key={activeSibling >= 0 ? info[activeSibling]?._id : "New"}
                  buttonProps={{
                    type: "button",
                    onClick: () => setActiveSibling(index),
                  }}
                  className={[
                    "w-fit border-0 py-2.5 rounded-full",
                    index === activeSibling
                      ? "bg-gray-300 dark:bg-gray-500/50"
                      : "hover:bg-gray-500/30 opacity-50",
                  ]}
                >
                  {sibling.name.split(" ")[0]}
                </OutlinedButton>
              </>
            ))}
          </div>
          <OutlinedButton
            buttonProps={{ onClick: () => setActiveSibling(-1) }}
            variant="custom"
            className={[
              "text-sm min-w-max rounded-full",
              activeSibling === -1
                ? "bg-cyan-500 text-white"
                : "hover:bg-cyan-500/30 border-cyan-500 text-cyan-500",
            ]}
          >
            + Add
          </OutlinedButton>
        </div>
      )}
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
            key={formValues.isInSameSchool}
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
          {isPending
            ? "Saving..."
            : activeSibling === -1
            ? "Save"
            : "Save Changes"}
        </SimpleButton>
      </form>
    </>
  );
};

export default SiblingsInfo;
