import { useEffect, useState } from "react";
import useExpandable from "@/hooks/useExpandable";
import Input from "@/components/ui/Input";
import SimpleButton from "../ui/SimpleButton";
import { getStudentInfo } from "@/services/studentInfoService";
import OutlinedButton from "../ui/OutlinedButton";
import SelectOption from "../ui/SelectOption";
import Checkbox from "../ui/CheckBox";

const CLASSES = [
  { value: "Jr. KG", text: "Jr. KG" },
  { value: "Sr. KG", text: "Sr. KG" },
  { value: "1", text: "1" },
  { value: "2", text: "2" },
  { value: "3", text: "3" },
  { value: "4", text: "4" },
  { value: "5", text: "5" },
  { value: "6", text: "6" },
  { value: "7", text: "7" },
  { value: "8", text: "8" },
  { value: "9", text: "9" },
  { value: "10", text: "10" },
];

const SIBLING_RELATIONS = [
  { value: "Brother", text: "Brother" },
  { value: "Sister", text: "Sister" },
];

const DIVISIONS = [
  { value: "A", text: "A" },
  { value: "B", text: "B" },
  { value: "C", text: "C" },
  { value: "D", text: "D" },
];

const SiblingsInfo = () => {
  const [activeSibling, setActiveSibling] = useState(-1);
  const { height, setExpanded, containerRef, expanded } = useExpandable(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await getStudentInfo();
      setInfo(response.data.siblingInfo);
    })();
  }, []);

  useEffect(() => {
    setActiveSibling(info?.length > 0 ? 0 : -1);
    console.log(info);
  }, [info]);

  useEffect(() => {
    setExpanded(
      activeSibling >= 0 ? info?.at(activeSibling)?.isInSameSchool : false
    );
  }, [activeSibling, info, setExpanded]);

  return (
    <>
      {info?.length > 0 && (
        <div className="container flex flex-nowrap items-center gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1 justify-center w-fit text-sm">
            {info.map((sibling, index) => (
              <>
                <OutlinedButton
                  variant="custom"
                  key={
                    activeSibling >= 0 ? info?.at(activeSibling)?._id : "New"
                  }
                  buttonProps={{
                    type: "button",
                    onClick: () => setActiveSibling(index),
                  }}
                  className={[
                    "w-fit border-0 py-2.5 rounded-full",
                    index === activeSibling
                      ? "bg-gray-500/50"
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
            variant="info"
            className={["text-sm min-w-max rounded-full", activeSibling === -1 && "bg-cyan-500 text-white hover:bg-cyan-500"]}
          >
            + Add
          </OutlinedButton>
        </div>
      )}
      <form action={null} className="space-y-6">
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <SelectOption
            key={
              activeSibling >= 0
                ? info?.at(activeSibling)?._id + "relation"
                : "relation default"
            }
            title="Relationship to student: "
            options={SIBLING_RELATIONS}
            selectProps={{
              name: "relation",
              required: true,
              defaultValue:
                activeSibling >= 0
                  ? info?.at(activeSibling)?.relation
                  : "Brother",
            }}
            selectStyle="border border-gray-300 dark:border-gray-600"
          />
          <hr />
          <div className="flex gap-4">
            <Input
              key={
                activeSibling >= 0
                  ? info?.at(activeSibling)._id + "name"
                  : "name not loaded"
              }
              titleText="Name"
              inputProps={{
                name: "name",
                required: true,
                defaultValue:
                  activeSibling >= 0 ? info?.at(activeSibling)?.name : "",
              }}
              labelStyle="basis-3/4"
            ></Input>
            <Input
              key={
                activeSibling >= 0
                  ? info?.at(activeSibling)?._id + "age"
                  : "age not loaded"
              }
              titleText="Age"
              inputProps={{
                name: "age",
                required: true,
                type: "number",
                defaultValue:
                  activeSibling >= 0 ? info?.at(activeSibling)?.age : 1,
              }}
              labelStyle="basis-1/4"
            ></Input>
          </div>
          <Checkbox
            key={
              activeSibling >= 0
                ? info?.at(activeSibling)?.class + "class"
                : "default sibling class"
            }
            label="Is the sibling currently studying in this school?"
            inputProps={{
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
                key={
                  activeSibling >= 0
                    ? info?.at(activeSibling)?.class + "class"
                    : "default sibling class"
                }
                title="Select Class"
                options={CLASSES}
                selectProps={{
                  name: "class",
                  required: true,
                  defaultValue:
                    activeSibling >= 0
                      ? info?.at(activeSibling)?.class
                      : "Jr. KG",
                }}
                selectStyle="border border-gray-300 dark:border-gray-600"
              />
              <SelectOption
                key={
                  activeSibling >= 0
                    ? info?.at(activeSibling).div + "div"
                    : "default sibling div"
                }
                title="Select Division"
                options={DIVISIONS}
                selectProps={{
                  name: "div",
                  required: true,
                  defaultValue:
                    activeSibling >= 0 ? info?.at(activeSibling)?.class : "A",
                }}
                selectStyle="border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
        <SimpleButton>
          {activeSibling === -1 ? "Save" : "Save Changes"}
        </SimpleButton>
      </form>
    </>
  );
};

export default SiblingsInfo;
