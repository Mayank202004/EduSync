import { isNonEmptyString, isValidName } from "@/lib/textUtils";

export const validateAccountDetails = (values) => {
  const { username, fullName } = values;
  const errors = new Map();

  if (!isNonEmptyString(username)) {
    errors.set("username", "Username cannot be empty");
  }

  if (!isNonEmptyString(fullName)) {
    errors.set("fullName", "Full Name cannot be empty");
  } else if (!isValidName(fullName)) {
    errors.set(
      "fullName",
      "Full Name should contain alphabets and spaces only"
    );
  }

  return errors;
};
