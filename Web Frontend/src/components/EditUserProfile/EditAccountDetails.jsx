import { useActionState } from "react";

import Input from "@/components/ui/Input";
import SimpleButton from "@/components/ui/SimpleButton";

import accountDetailsAction from "./form_actions/accountDetailsAction";

const EditAccountDetails = ({ accountInfo }) => {
  const [accountData, formAction, isPending] = useActionState(
    accountDetailsAction,
    {
      errors: null,
      inputValues: {
        username: accountInfo.username,
        fullName: accountInfo.fullName,
      },
    }
  );

  return (
    <form className="space-y-6" action={formAction}>
      <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
        <Input
          key={accountData.inputValues.username}
          titleText="Username"
          error={accountData.error?.get("username")}
          inputProps={{
            name: "username",
            type: "text",
            placeholder: "Username",
            required: true,
            defaultValue: accountData.inputValues.username,
          }}
        />
        <Input
          key={accountData.inputValues.fullName}
          titleText="Full Name"
          error={accountData.error?.get("fullName")}
          inputProps={{
            name: "fullName",
            type: "text",
            placeholder: "Full Name",
            required: true,
            defaultValue: accountData.inputValues.fullName,
          }}
          hints={[
            { text: "Format: <first name> <middle name> <last name>" },
            { text: "E.g: Mayank Sachin Chougale" },
          ]}
        />
      </div>
      <SimpleButton buttonProps={{ type: "submit", disabled: isPending }}>
        {isPending ? "Saving..." : "Save Changes"}
      </SimpleButton>
    </form>
  );
};

export default EditAccountDetails;
