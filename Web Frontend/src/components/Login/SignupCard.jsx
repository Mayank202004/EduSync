import React, { useActionState } from "react";
import { loginApi, signupApi } from "@/services/authService";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import SelectOption from "../ui/SelectOption";
import SimpleButton from "../ui/SimpleButton";

import { ROLES_MAP } from "./value_maps/signupMaps";
const signUpAction = async (prevState, formData) => {

}

const inputStyle = "border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black"

function SignupCard({ switchToLogin }) {
  const [signUpValues, formAction, isPending] = useActionState(signUpAction, {
    errors: null,
    inputValues: {
      email: "",
      username: "",
      fullName: "",
      role: "",
      password: "",
    },
  });

  return (
    <div className="h-full w-100 flex items-center justify-center">
      <div className="w-full bg-white rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          EduSync
        </h1>
        <form className="space-y-4" action={formAction}>
          <div>
            <Input
            inputStyle={inputStyle}
              key={signUpValues.inputValues.fullName}
              error={signUpValues.errors?.get("fullName")}
              inputProps={{
                name: "fullName",
                required: true,
                placeholder: "Full Name",
                defaulValue: signUpValues.inputValues.fullName,
              }}
            />
            <Input
            inputStyle={inputStyle}
              key={signUpValues.inputValues.username}
              error={signUpValues.errors?.get("username")}
              inputProps={{
                name: "username",
                required: true,
                placeholder: "Username",
                defaulValue: signUpValues.inputValues.username,
              }}
            />
            <SelectOption
              key={signUpValues.inputValues.role}
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
              key={signUpValues.inputValues.email}
              error={signUpValues.errors?.get("email")}
              inputProps={{
                name: "email",
                required: true,
                placeholder: "Email",
                defaulValue: signUpValues.inputValues.email,
              }}
            />
            <Input
            inputStyle={inputStyle}
              key={signUpValues.inputValues.password}
              error={signUpValues.errors?.get("password")}
              inputProps={{
                name: "password",
                required: true,
                placeholder: "Password",
                defaulValue: signUpValues.inputValues.password,
              }}
            />
          </div>
          <SimpleButton predefinedColor="custom" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Sign Up
          </SimpleButton>
        </form>

        <div className="mt-2 text-sm text-center text-gray-600">
          Already have an account account?{" "}
          <button
            onClick={switchToLogin} // Swap signupCard with loginCard
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupCard;
