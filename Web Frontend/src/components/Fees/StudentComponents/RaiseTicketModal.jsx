import { useActionState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import SelectOption from "@/components/ui/SelectOption";
import SimpleButton from "@/components/ui/SimpleButton";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";

import { createTicket } from "@/services/raiseTicktetService";

import { isNonEmptyString } from "@/utils/textUtils";
import toast from "react-hot-toast";

const FEE_ISSUES_MAP = [
  { value: "Payment", text: "Payment" },
  { value: "Fee Amount", text: "Fee Amount" },
  { value: "Fee Receipt", text: "Fee Receipt" },
  { value: "Other", text: "Other" },
];

const isValidSubCategory = (category) => {
  return FEE_ISSUES_MAP.some(({ value, disabled }) => value === category && !disabled);
};

const validateTicketDetails = (values) => {
  const { subCategory, title, description } = values;
  const errors = new Map();

  if (!isNonEmptyString(subCategory)) {
    throw new Error("Category cannot be empty.");
  } else {
    if (!isValidSubCategory(subCategory)) {
      throw new Error("Invalid category")
    }
  }

  if (!isNonEmptyString(title)) {
    errors.set("title", "Issue title is required.");
  }

  if (!isNonEmptyString(description)) {
    errors.set("description", "Description is required.");
  }

  return errors;
};

const raiseTicketAction = (prevState, formData) => {
  const values = {
    subCategory: formData.get("subCategory")?.trim() || "",
    title: formData.get("title")?.trim() || "",
    description: formData.get("description")?.trim() || "",
  };

  try {
    const errors = validateTicketDetails(values);
    if (errors.size !== 0) return { errors, inputValues: values };

    values.category = "Fee"; //manually set category to fee
    toast.promise(createTicket(values), {
      loading: "Issuing ticket...",
      success: "Ticket issued successfully",
    });
    return {
      errors: null,
      inputValues: {
        subCategory: FEE_ISSUES_MAP[0].value,
        title: "",
        description: "",
      },
    };
  } catch (err) {
    if (err?.message) toast.error(err.message); //for validation error

    return {
      errors: null,
      inputValues: values,
    };
  }
};

export const RaiseTicketModal = ({ closeModalCallback }) => {
  const [containerRef] = useClickOutside(closeModalCallback);
  const [ticketDetails, formAction, isPending] = useActionState(
    raiseTicketAction,
    {
      errors: null,
      inputValues: {
        subCategory: FEE_ISSUES_MAP[0].value,
        title: "",
        description: "",
      },
    }
  );

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        ref={containerRef}
        action={formAction}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h1 className="font-bold text-xl mb-4">Raise Ticket</h1>
        <SelectOption
          key={ticketDetails.inputValues.subCategory}
          title="Issue related to"
          options={FEE_ISSUES_MAP}
          selectProps={{ name: "subCategory", required: true, defaultValue: ticketDetails.inputValues.subCategory }}
        />
        <Input
          titleText="Title of issue"
          error={ticketDetails.errors?.get("title")}
          inputProps={{
            name: "title",
            placeholder: "e.g. Payment did not reflect",
            defaultValue: ticketDetails.inputValues.title,
            required: true,
          }}
        />
        <TextArea
          titleText="Description"
          textAreaStyle="h-30"
          error={ticketDetails.errors?.get("description")}
          textAreaProps={{
            name: "description",
            placeholder: "Description",
            defaultValue: ticketDetails.inputValues.description,
            required: true,
          }}
        />
        <div className="flex gap-2 ml-auto my-2">
          <SimpleButton
            predefinedColor="gray"
            buttonProps={{ type: "button", onClick: closeModalCallback }}
          >
            Cancel
          </SimpleButton>
          <SimpleButton className="ml-0" predefinedColor="blue">
            {isPending ? "Issuing..." : "Raise issue"}
          </SimpleButton>
        </div>
      </form>
    </div>
  );
};
