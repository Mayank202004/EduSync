import { addFeeStructure } from "@/services/feeService";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { formatToYYYYMM_D } from "@/utils/dateUtils";
import useClickOutside from "@/hooks/useClickOutside";
import useExpandable from "@/hooks/useExpandable";

import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import Checkbox from "@/components/ui/CheckBox";
import ExpandableDiv from "@/components/ui/ExpandableDiv";
import SimpleButton from "@/components/ui/SimpleButton";

const FEE_TYPES = [
  { value: "Tuition Fee", text: "Tuition Fee" },
  { value: "Transport Fee", text: "Transport Fee" },
  { value: "Other Fee", text: "Other Fee" },
];

const AddFeeModal = ({
  onClose,
  onSubmit,
  onAdd,
  loadingMessage = "Adding fee data...",
  successMessage = "Fee added successfully!",
  errorMessage = "",
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [feeType, setFeeType] = useState(FEE_TYPES[0]);
  const [discount, setDiscount] = useState(0);
  const [compulsory, setCompulsory] = useState(false);
  const [addToAll, setAddToAll] = useState(false);
  const [className, setClassName] = useState("");

  const [backgroundContainerRef] = useClickOutside(onClose);
  const { expanded, setExpanded, height, containerRef } = useExpandable(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !amount ||
      !dueDate ||
      (!addToAll && !className.trim())
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      title,
      amount: parseFloat(amount),
      dueDate: formatToYYYYMM_D(dueDate),
      feeType,
      discount: parseFloat(discount),
      compulsory,
      className: addToAll ? null : className.trim(),
      addToAllClasses: addToAll,
    };

    try {
      const response = await toast.promise(addFeeStructure(payload), {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      });

      onSubmit(payload);
    } catch (err) {
      // Error is handled by toast.promise
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        ref={backgroundContainerRef}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add New Fee</h2>

        <Input
          titleText="Title"
          inputProps={{
            name: "title",
            type: "text",
            placeholder: "e.g. Term 1",
            required: true,
          }}
        />
        <Input
          titleText="Amount (₹)"
          inputProps={{
            name: "title",
            type: "number",
            placeholder: "e.g. 12000",
            required: true,
          }}
        />
        <Input
          titleText="Due date"
          inputProps={{
            name: "due_date",
            type: "date",
            required: true,
          }}
        />
        <SelectOption
          title="Fee type"
          options={FEE_TYPES}
          containerStyle="flex-col gap-1.5 items-start w-full"
          selectStyle="w-full"
        />

        {/* <div className="mb-3">
          <label className="block mb-1 font-medium">Fee Type</label>
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-customDarkFg"
          >
            {FEE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div> */}

        <Input
          titleText="Discount (%)"
          inputProps={{
            name: "discount",
            type: "number",
            placeholder: "e.g. 10",
          }}
        />

        <hr className="my-2" />
        <Checkbox
          label="Compulsory fee"
          inputProps={{ name: "compulsory_fee" }}
        />
        <Checkbox
          label="Add to all classes"
          inputProps={{
            name: "add_to_all",
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
            titleText="Class name"
            inputProps={{ name: "class_name", placeholder: "e.g. 1, 2A" }}
          />
        </ExpandableDiv>

        <div className="flex gap-2 ml-auto my-2">
          <SimpleButton
            predefinedColor="gray"
            buttonProps={{ type: "button", onClick: onClose }}
          >
            Cancel
          </SimpleButton>
          <SimpleButton className="ml-0" predefinedColor="blue">Add Fee</SimpleButton>
        </div>
      </form>
    </div>
  );
};

export default AddFeeModal;
