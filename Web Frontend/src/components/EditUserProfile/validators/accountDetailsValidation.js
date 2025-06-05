import {
  isNonEmptyString,
  isValidName,
} from "@/lib/textUtils"; // adjust path as needed

function validateAccountDetails(values) {
  const { username, fullName } = values;

  if (!isNonEmptyString(username) || !isNonEmptyString(fullName)) {
    throw new Error("Username and Full Name cannot be empty");
  }

  if (!isValidName(fullName)) {
    throw new Error("Full Name should contain alphabets and spaces only");
  }
}

export default validateAccountDetails;