import { useActionState } from "react";
import Input from "../UI/Input";
import SimpleButton from "../UI/SimpleButton";

import changePasswordAction from "./form_actions/changePasswordAction";

const ChangePassword = () => {
  const [changePasswordDetails, formAction, isPending] = useActionState(
    changePasswordAction,
    {
      errors: null,
      inputValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    }
  );

  return (
    <form action={formAction}>
      <div className="border-1 flex flex-col gap-2 rounded-sm px-6 py-5 mb-4">
        <Input
          titleText="Old Password"
          error={changePasswordDetails.errors?.get("oldPassword")}
          inputProps={{
            name: "oldPassword",
            type: "password",
            required: true,
            defaultValue: changePasswordDetails.inputValues.oldPassword,
          }}
        />
        <Input
          titleText="New Password"
          error={changePasswordDetails.errors?.get("newPassword")}
          inputProps={{
            name: "newPassword",
            type: "password",
            required: true,
            defaultValue: changePasswordDetails.inputValues.newPassword,
          }}
        />
        <Input
          titleText="Confirm Password"
          error={changePasswordDetails.errors?.get("confirmPassword")}
          inputProps={{
            name: "confirmPassword",
            type: "password",
            required: true,
            defaultValue: changePasswordDetails.inputValues.confirmPassword,
          }}
        />
      </div>
      <SimpleButton buttonProps={{ type: "submit" }}>
        {isPending ? "Updating..." : "Confirm"}
      </SimpleButton>
    </form>
  );
};

export default ChangePassword;
