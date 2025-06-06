import { isNonEmptyString, isValidNumber, isValidName } from "@/lib/textUtils";

const isValidRelation = (value) =>
  ["Brother", "Sister"].includes(value);

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

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(relation) ||
    !isValidNumber(age)
  ) {
    throw new Error("Name, Relation and Age cannot be empty");
  }

  if (!isValidName(name)) {
    throw new Error("Name must contain only alphabets and spaces")
  }

  if (!isValidRelation(relation)) {
    throw new Error("Invalid relation. Must be 'Brother' or 'Sister'");
  }
  
  if (age === 0) {
    throw new Error("Age cannot be 0");
  }

  if (isInSameSchool) {
    if (!isNonEmptyString(siblingClass) || !isNonEmptyString(div)) {
      throw new Error(
        "Class and division are required when sibling is in the same school"
      );
    }

    if (!isValidClass(siblingClass)) {
      throw new Error("Invalid class value");
    }

    if (!isValidDivision(div)) {
      throw new Error("Invalid division value");
    }
  }

  return true;
};