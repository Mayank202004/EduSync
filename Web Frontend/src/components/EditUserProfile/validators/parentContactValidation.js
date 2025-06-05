import { isNonEmptyString, isValidName } from "@/lib/textUtils";

const isValidRelation = (value) =>
  ["Father", "Mother"].includes(value);

export const validateParentContact = (values) => {
  const {name, relation, phone} = values;
  if (!isNonEmptyString(name) || !isValidName(name)) {
    throw new Error("Please enter a valid name (letters and spaces only).");
  }

  if (!isNonEmptyString(relation) || !isValidRelation(relation)) {
    throw new Error("Please enter a valid relation (letters and spaces only).");
  }

  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Phone number must be exactly 10 digits.");
  }

  return true;
};