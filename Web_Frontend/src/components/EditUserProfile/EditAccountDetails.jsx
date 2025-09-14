import { useActionState, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";

import Input from "@/components/UI/Input";
import SimpleButton from "@/components/UI/SimpleButton";
import Modal from "../Modals/Modal";
import accountDetailsAction from "./form_actions/accountDetailsAction";

import ChangePassword from "./ChangePassword";

const EditAccountDetails = ({ accountInfo }) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [containerRef] = useClickOutside(() => setShowPasswordChange(false));

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
    <>
      {showPasswordChange && (
        <Modal
          ref={containerRef}
          title="Change Password"
          onClose={() => setShowPasswordChange(false)}
        >
          <ChangePassword />
        </Modal>
      )}
      <form className="space-y-6" action={formAction}>
        <div className="flex flex-col gap-4 border-1 mx-auto py-5 px-6 sm:px-10 md:px-15 rounded-sm">
          <Input
            key={accountData.inputValues.username}
            titleText="Username"
            error={accountData.errors?.get("username")}
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
            error={accountData.errors?.get("fullName")}
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
          <SimpleButton
            className="ml-0"
            buttonProps={{
              type: "button",
              onClick: () => setShowPasswordChange(true),
            }}
          >
            Change Password
          </SimpleButton>
        </div>
        <SimpleButton buttonProps={{ type: "submit", disabled: isPending }}>
          {isPending ? "Saving..." : "Save Changes"}
        </SimpleButton>
      </form>
    </>
  );
};

export default EditAccountDetails;
