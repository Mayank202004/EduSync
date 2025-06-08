import { isValidName, isNonEmptyString, isValidNumber } from "@/lib/textUtils";

export const validateParentInfoForm = (data) => {
  const {
    fatherName,
    fatherOccupation,
    fatherIncome,
    motherName,
    motherOccupation,
    motherIncome,
  } = data;

  const errors = new Map();

  if (!isNonEmptyString(fatherName)) {
    errors.set("fathers-name", "Father's name cannot be empty.");
  } else if (!isValidName(fatherName)) {
    errors.set(
      "fathers-name",
      "Father's name should contain only letters and spaces."
    );
  }

  if (!isNonEmptyString(motherName)) {
    errors.set("mothers-name", "Mother's name cannot be empty.");
  } else if (!isValidName(motherName)) {
    errors.set(
      "mothers-name",
      "Mother's name should contain only letters and spaces."
    );
  }

  if (!isNonEmptyString(fatherOccupation)) {
    errors.set("fathers-occupation", "Father's occupation cannot be empty.");
  }

  if (!isNonEmptyString(motherOccupation)) {
    errors.set("mothers-occupation", "Mother's occupation cannot be empty.");
  }

  if (!isValidNumber(fatherIncome)) {
    errors.set("fathers-income", "Father's income must be a valid number.");
  }

  if (!isValidNumber(motherIncome)) {
    errors.set("mothers-income", "Mother's income must be a valid number.");
  }

  return errors;
};