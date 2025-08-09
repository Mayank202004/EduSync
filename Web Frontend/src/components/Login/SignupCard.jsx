import React, { useState } from "react";

import Input from "@/components/UI/Input";
import SelectOption from "@/components/Chat/SelectOption";
import SimpleButton from "@/components/UI/SimpleButton";
import LinkButton from "@/components/UI/LinkButton";

import signUpAction from "./form_actions/signUpAction";
import { ROLES_MAP } from "./value_maps/signupMaps";

const inputStyle =
  "border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black my-0.5";

const CLASS_OPTIONS = [
  { text: "-- Select Class --", value: "", disabled: true },
  ...Array.from({ length: 12 }, (_, i) => ({
    text: `Class ${i + 1}`,
    value: `${i + 1}`,
  })),
];


function SignupCard({ switchToLogin }) {
  const [inputValues, setInputValues] = useState({
    email: "",
    username: "",
    fullName: "",
    role: "",
    password: "",
    class: "",
  });

  const [errors, setErrors] = useState(new Map());
  const [isPending, setIsPending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.target);
    const result = await signUpAction({ errors, inputValues }, formData, switchToLogin);

    setErrors(result.errors ?? new Map());
    setInputValues(result.inputValues);
    setIsPending(false);
  };

  return (
    <div className="h-full w-100 flex items-center justify-center">
      <div className="w-full bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">EduSync</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <Input
              inputStyle={inputStyle}
              key="fullName"
              error={errors?.get("fullName")}
              inputProps={{
                name: "fullName",
                required: true,
                placeholder: "Full Name",
                value: inputValues.fullName,
                onChange: handleInputChange,
              }}
            />
            <Input
              inputStyle={inputStyle}
              key="username"
              error={errors?.get("username")}
              inputProps={{
                name: "username",
                required: true,
                placeholder: "Username",
                value: inputValues.username,
                onChange: handleInputChange,
              }}
            />
            <SelectOption
              key="role"
              options={ROLES_MAP}
              containerStyle="w-full my-1.5"
              selectStyle="w-full border text-black rounded-md p-2.5 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              optionStyle="text-black dark:bg-white"
              nostyle={true}
              selectProps={{
                name: "role",
                required: true,
                value: inputValues.role,
                onChange: handleInputChange,
              }}
            />

            {/* Class field for students */}
            {inputValues.role === "student" && (
              <SelectOption
                key="class"
                options={CLASS_OPTIONS}
                containerStyle="w-full my-1.5"
                selectStyle="w-full border text-black rounded-md p-2.5 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
                optionStyle="text-black dark:bg-white"
                nostyle={true}
                selectProps={{
                  name: "class",
                  required: true,
                  value: inputValues.class,
                  onChange: handleInputChange,
                }}
              />
            )}

            <Input
              inputStyle={inputStyle}
              key="email"
              error={errors?.get("email")}
              inputProps={{
                type: "email",
                name: "email",
                required: true,
                placeholder: "Email",
                value: inputValues.email,
                onChange: handleInputChange,
              }}
            />
            <Input
              inputStyle={inputStyle}
              key="password"
              error={errors?.get("password")}
              inputProps={{
                type: "password",
                name: "password",
                required: true,
                placeholder: "Password",
                value: inputValues.password,
                onChange: handleInputChange,
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
          <span>Already have an account?</span>
          <LinkButton buttonProps={{ onClick: switchToLogin }}>Sign in</LinkButton>
        </div>
      </div>
    </div>
  );
}

export default SignupCard;
