import { isNonEmptyString, isValidEmail } from "@/lib/textUtils";

export const validateSignIn = (values) => {
  const { identifier, password } = values;
  const errors = new Map();

  // Username/email field
  if (!isNonEmptyString(identifier)) {
    errors.set("username", "Username or email is required.");
  } else if (identifier.includes("@") && !isValidEmail(identifier)) {
    errors.set("username", "Invalid email address.");
  }

  // Password field
  if (!isNonEmptyString(password)) {
    errors.set("password", "Password is required.");
  }

  return errors;
};