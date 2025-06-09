import React from "react";
import { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";

import Input from "../ui/Input";
import SimpleButton from "../ui/SimpleButton";
import LinkButton from "../ui/LinkButton";

import signInAction from "./form_actions/signInAction";

const inputStyle =
  "border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-black my-0.5";

const LoginCard = ({ switchToSignup }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [signInValues, formAction, isPending] = useActionState(
    (prevState, formData) => signInAction(prevState, formData, onSuccess),
    {
      errors: null,
      inputValues: {
        identifier: "",
        password: "",
      },
    }
  );

  const onSuccess = (data) => {
    login(data);
    navigate("/");
  };

  return (
    <div className="h-full w-100 flex items-center justify-center">
      <div className="w-full bg-white rounded-xl p-8 justify-center">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          EduSync
        </h1>
        <form className="flex flex-col gap-2" action={formAction}>
          <Input
            inputStyle={inputStyle}
            key={signInValues.inputValues.identifier + "identifier-SignIn"}
            error={signInValues.errors?.get("identifier")}
            inputProps={{
              name: "identifier",
              required: true,
              placeholder: "Username or Email",
              defaultValue: signInValues.inputValues.identifier,
            }}
          />
          <Input
            inputStyle={inputStyle}
            key={signInValues.inputValues.password + "password-SignIp"}
            error={signInValues.errors?.get("password")}
            inputProps={{
              type: "password",
              name: "password",
              required: true,
              placeholder: "Password",
              defaultValue: signInValues.inputValues.password,
            }}
          />
          <SimpleButton
            buttonProps={{ type: "submit", disabled: isPending }}
            predefinedColor="custom"
            className="w-full bg-blue-600 not-disabled:hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </SimpleButton>
        </form>

        <Link
          to="/forgot-password"
          className="block text-blue-500 hover:underline mt-4 text-sm text-center"
        >
          Forgot password?
        </Link>

        <div className="flex flex-wrap gap-1.5 mt-0.5 w-fit mx-auto text-center text-sm text-gray-600">
          <span className="">Don’t have an account??</span>
          <LinkButton
            text="Sign up"
            buttonProps={{ onClick: switchToSignup }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
