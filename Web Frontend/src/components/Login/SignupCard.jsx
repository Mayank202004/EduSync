import React, { useActionState } from "react";

import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import SimpleButton from "@/components/ui/SimpleButton";
import LinkButton from "@/components/ui/LinkButton";

import signUpAction from "./form_actions/signUpAction";
import { ROLES_MAP } from "./value_maps/signupMaps";

const inputStyle =
  "border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black my-0.5";

function SignupCard({ switchToLogin }) {
  const [signUpValues, formAction, isPending] = useActionState(
    (prevState, formData) => signUpAction(prevState, formData, switchToLogin),
    {
      errors: null,
      inputValues: {
        email: "",
        username: "",
        fullName: "",
        role: "",
        password: "",
      },
    }
  );

  return (
    <div className="h-full w-100 flex items-center justify-center">
      <div className="w-full bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          EduSync
        </h1>
        <form className="space-y-4" action={formAction}>
          <div className="flex flex-col gap-1">
            <Input
              inputStyle={inputStyle}
              key={signUpValues.inputValues.fullName + "fullName-Signup"}
              error={signUpValues.errors?.get("fullName")}
              inputProps={{
                name: "fullName",
                required: true,
                placeholder: "Full Name",
                defaultValue: signUpValues.inputValues.fullName,
              }}
            />
            <Input
              inputStyle={inputStyle}
              key={signUpValues.inputValues.username + "username-Signup"}
              error={signUpValues.errors?.get("username")}
              inputProps={{
                name: "username",
                required: true,
                placeholder: "Username",
                defaultValue: signUpValues.inputValues.username,
              }}
            />
            <SelectOption
              key={signUpValues.inputValues.role + "role-Signup"}
              options={ROLES_MAP}
              containerStyle="w-full my-1.5"
              selectStyle="w-full border text-black rounded-md p-2.5 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              optionStyle="text-black dark:bg-white"
              nostyle={true}
              selectProps={{
                name: "role",
                required: true,
                defaultValue: signUpValues.inputValues.role,
              }}
            />
            <Input
              inputStyle={inputStyle}
              key={signUpValues.inputValues.email + "email-Signup"}
              error={signUpValues.errors?.get("email")}
              inputProps={{
                type: "email",
                name: "email",
                required: true,
                placeholder: "Email",
                defaultValue: signUpValues.inputValues.email,
              }}
            />
            <Input
              inputStyle={inputStyle}
              key={signUpValues.inputValues.password + "password-Signup"}
              error={signUpValues.errors?.get("password")}
              inputProps={{
                type: "password",
                name: "password",
                required: true,
                placeholder: "Password",
                defaultValue: signUpValues.inputValues.password,
              }}
            />
          </div>
          <SimpleButton
            buttonProps={{ disabled: isPending }}
            predefinedColor="custom"
            className="w-full bg-blue-600 not-disabled:hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </SimpleButton>
        </form>
        <div className="flex flex-wrap gap-1.5 mt-0.5 w-fit mx-auto text-center text-sm text-gray-600">
          <span className="">Already have an account account?</span>
          <LinkButton buttonProps={{ onClick: switchToLogin }}>Sign in</LinkButton>
        </div>
      </div>
    </div>
  );
}

export default SignupCard;
