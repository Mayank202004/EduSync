import { useActionState, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import useExpandable from "@/hooks/useExpandable";

import Input from "@/components/Chat/Input";
import SelectOption from "@/components/Chat/SelectOption";
import Checkbox from "@/components/Chat/CheckBox";
import ExpandableDiv from "@/components/Chat/ExpandableDiv";
import SimpleButton from "@/components/Chat/SimpleButton";

import { newFeeAction } from "./form_actions/newFeeAction";

import { FEE_TYPES } from "./value_maps/feeMaps";

const AddFeeModal = ({
  onClose,
  // onSubmit,
  // onAdd,
}) => {
  const [backgroundContainerRef] = useClickOutside(onClose);
  const { expanded, setExpanded, height, containerRef } = useExpandable(true);
  const [isCompulsory, setIsCompulsory] = useState(false);

  const [feeInfo, formAction, isPending] = useActionState(newFeeAction, {
    errors: null,
    inputValues: {
      title: "",
      amount: "",
      dueDate: "",
      feeType: FEE_TYPES[0].value,
      discount: "",
      compulsory: false,
      addToAll: false,
      className: "",
    },
  });

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        action={formAction}
        ref={backgroundContainerRef}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add New Fee</h2>

        <Input
          key={feeInfo.inputValues.title + "title"}
          titleText="Title"
          error={feeInfo.errors?.get("title")}
          inputProps={{
            name: "title",
            type: "text",
            placeholder: "e.g. Term 1",
            defaultValue: feeInfo.inputValues.title,
            required: true,
          }}
        />
        <Input
          key={feeInfo.inputValues.amount + "amount"}
          titleText="Amount (₹)"
          error={feeInfo.errors?.get("amount")}
          inputProps={{
            name: "amount",
            type: "number",
            placeholder: "e.g. 12000",
            defaultValue: feeInfo.inputValues.amount,
            required: true,
          }}
        />
        <Input
          key={feeInfo.inputValues.dueDate + "dueDate"}
          titleText="Due date"
          error={feeInfo.errors?.get("dueDate")}
          inputProps={{
            name: "dueDate",
            type: "date",
            defaultValue: feeInfo.inputValues.dueDate,
            required: true,
          }}
        />
        <SelectOption
          key={feeInfo.inputValues.feeType}
          title="Fee type"
          options={FEE_TYPES}
          selectProps={{
            name:"feeType",
            required: true,
            defaultValue: feeInfo.inputValues.feeType,
          }}
          containerStyle="flex-col gap-1.5 items-start w-full"
          selectStyle="w-full"
        />

        <Input
          key={feeInfo.inputValues.discount + "discount"}
          titleText="Discount (%)"
          error={feeInfo.errors?.get("discount")}
          inputProps={{
            name: "discount",
            type: "number",
            placeholder: "e.g. 10",
            defaultValue: feeInfo.inputValues.discount,
          }}
        />

        <hr className="my-2" />
        <Checkbox
          key={feeInfo.inputValues.compulsory + "compulsory"}
          label="Compulsory fee"
          inputProps={{
            name: "compulsory",
            value: "compulsary",
            checked: isCompulsory,
            onChange: (e) => setIsCompulsory(e.target.checked)
          }}
        />
        <Checkbox
          key={feeInfo.inputValues.addToAll}
          label="Add to all classes"
          inputProps={{
            name: "addToAll",
            value: "addtoAll",
            checked: !expanded,
            onChange: (e) => {
              setExpanded(!e.target.checked);
            },
          }}
        />

        <ExpandableDiv
          className="mt-1.5"
          containerRef={containerRef}
          height={height}
        >
          <Input
            key={feeInfo.inputValues.className + "className"}
            titleText="Class name"
            error={feeInfo.errors?.get("className")}
            inputProps={{
              name: "className",
              placeholder: "e.g. 1, 2A",
              defaultValue: feeInfo.inputValues.className,
              required: expanded
            }}
          />
        </ExpandableDiv>

        <div className="flex gap-2 ml-auto my-2">
          <SimpleButton
            predefinedColor="gray"
            buttonProps={{ type: "button", onClick: onClose, disabled: isPending }}
          >
            Cancel
          </SimpleButton>
          <SimpleButton className="ml-0" predefinedColor="blue" buttonProps={{ disabled: isPending }}>
            {isPending ? "Adding...": "Add Fee"}
          </SimpleButton>
        </div>
      </form>
    </div>
  );
};

export default AddFeeModal;
