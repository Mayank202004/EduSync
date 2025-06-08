import { isNonEmptyString, isValidName, isValidNumber } from "@/lib/textUtils";

const isValidRelation = (value) => ["Father", "Mother"].includes(value);

export const validateParentContact = (values) => {
  const { name, relation, phone } = values;
  const errors = new Map();

  if (!isNonEmptyString(name)) {
    errors.set("name", "Name cannot be empty.");
  } else if (!isValidName(name)) {
    errors.set("name", "Name should contain letters and spaces only.");
  }

  if (!isNonEmptyString(relation)) {
    throw new Error("Relation cannot be empty.");
  } else if (!isValidRelation(relation)) {
    throw new Error("Relation should contain letters and spaces only.");
  }

  const phoneNum = Number(phone);
  if (!isValidNumber(phoneNum) || phone.toString().length !== 10) {
    errors.set("phone", "Phone number must be a valid 10-digit number.");
  }

  return errors;
};
