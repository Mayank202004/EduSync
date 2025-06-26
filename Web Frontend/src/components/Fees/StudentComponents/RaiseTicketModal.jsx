import useClickOutside from "@/hooks/useClickOutside";

import SelectOption from "@/components/ui/SelectOption";
import SimpleButton from "@/components/ui/SimpleButton";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { useState } from "react";

const FEE_ISSUES_MAP = [
  { value: "Payment", text: "Payment" },
  { value: "Fee Amount", text: "Fee Amount" },
  { value: "Fee Receipt", text: "Fee Receipt" },
  { value: "Other", text: "Other" },
];

export const RaiseTicketModal = ({ closeModalCallback }) => {
  const [containerRef] = useClickOutside(closeModalCallback);
  const [selectedAttachmentName, setSelectedAttachmentName] = useState("")

  const selectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedAttachmentName(file.name);
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        ref={containerRef}
        action=""
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h1 className="font-bold text-xl mb-4">Raise Ticket</h1>
        <SelectOption title="Issue related to" options={FEE_ISSUES_MAP} />
        <Input
          titleText="Title of issue"
          inputProps={{
            name: "className",
            placeholder: "e.g. Payment did not reflect",
            defaultValue: "",
            required: true,
          }}
        />
        <TextArea
          titleText="Description"
          textAreaStyle="h-30"
          textAreaProps={{
            name: "description",
            placeholder: "Description"
          }}
        />
        <span className="block font-semibold mb-1">Attachment</span>
        <label className="grid grid-cols-[0_1fr_auto] grid-rows-2 w-full cursor-pointer">
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .pdf, .docx"
            name="attachment"
            className="size-[1px] col-fit"
            onChange={selectFile}
          />
          <span className="w-full border-1 py-1.5 px-3 col rounded-sm truncate hover:ring-1">
            {selectedAttachmentName === "" ? "No file chosen" : selectedAttachmentName}
          </span>
          <span className="min-w-max border-1 py-1.5 px-3 ml-2 rounded-sm text-blue-400 border-blue-500 font-semibold hover:bg-blue-50 dark:hover:bg-blue-700/30 hover:ring-1">
            Choose file
          </span>
        </label>
        <div className="flex gap-2 ml-auto my-2">
          <SimpleButton
            predefinedColor="gray"
            buttonProps={{ type: "button", onClick: closeModalCallback }}
          >
            Cancel
          </SimpleButton>
          <SimpleButton className="ml-0" predefinedColor="blue">
            Raise issue
          </SimpleButton>
        </div>
      </form>
    </div>
  );
};
