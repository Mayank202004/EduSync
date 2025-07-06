import { isValidEmail, isValidName, isNonEmptyString } from "@/utils/textUtils";
import { ROLES_MAP } from "../value_maps/signupMaps";

export const isValidRole = (role) => {
  return ROLES_MAP.some(({ value, disabled }) => value === role && !disabled);
};

export const validateSignUp = (values) => {
  const { email, username, fullName, role, password, class: classValue } = values;
  const errors = new Map();

  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    errors.set("email", "Please enter a valid email address.");
  }

  if (!isNonEmptyString(username)) {
    errors.set("username", "Username cannot be empty.");
  }

  if (!isNonEmptyString(fullName) || !isValidName(fullName)) {
    errors.set("fullName", "Full name must only contain letters and spaces.");
  }

  if (!isValidRole(role)) {
    throw new Error("Select a valid role.");
  }

  if (!isNonEmptyString(password)) {
    errors.set("password", "Password cannot be empty.");
  }

  // ✅ Validate class only if role is student
  if (role === "student") {
    if (!isNonEmptyString(classValue)) {
      errors.set("class", "Class is required for students.");
    } else if (!/^[1-9][0-2]?$/.test(classValue.trim())) {
      errors.set("class", "Class must be a number between 1 and 12.");
    }
  }

  return errors;
};
