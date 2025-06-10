import { isNonEmptyString, isValidNumber, isValidName } from "@/utils/textUtils";

const isValidRelation = (value) => ["Brother", "Sister"].includes(value);

const isValidClass = (value) =>
  [
    "Jr. KG",
    "Sr. KG",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ].includes(value);

const isValidDivision = (value) => ["A", "B", "C", "D"].includes(value);

export const validateSiblingForm = (values) => {
  const {
    name,
    relation,
    age,
    isInSameSchool,
    class: siblingClass = null,
    div = null,
  } = values;

  const errors = new Map();

  if (!isNonEmptyString(name)) {
    errors.set("name", "Name cannot be empty.");
  } else if (!isValidName(name)) {
    errors.set("name", "Name must contain only alphabets and spaces.");
  }

  if (!isNonEmptyString(relation)) {
    throw new Error("Relation cannot be empty.");
  } else if (!isValidRelation(relation)) {
    throw new Error("Invalid relation. Must be 'Brother' or 'Sister'.");
  }

  if (!isValidNumber(age)) {
    errors.set("age", "Age must be a valid number.");
  } else if (age === 0) {
    errors.set("age", "Age cannot be 0.");
  }

  if (isInSameSchool) {
    if (!isNonEmptyString(siblingClass)) {
      throw new Error("Class is required when sibling is in the same school.");
    } else if (!isValidClass(siblingClass)) {
      throw new Error("Invalid class value.");
    }

    if (!isNonEmptyString(div)) {
      throw new Error(
        "Division is required when sibling is in the same school."
      );
    } else if (!isValidDivision(div)) {
      throw new Error("Invalid division value.");
    }
  }

  return errors;
};
