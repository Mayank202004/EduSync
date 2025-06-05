import {
  isValidName,
  isNonEmptyString,
  isValidNumber,
} from "@/lib/textUtils"; // adjust path if needed

export const validateParentInfoForm = (data) => {
  const {
    fatherName,
    fatherOccupation,
    fatherIncome,
    motherName,
    motherOccupation,
    motherIncome,
  } = data;

  if (
    ![fatherName, fatherOccupation, motherName, motherOccupation].every(isNonEmptyString)
  ) {
    throw new Error("All text fields must be non-empty.");
  }

  if (![fatherName, motherName].every(isValidName)) {
    throw new Error("Names must contain only letters and spaces.");
  }

  if (![fatherIncome, motherIncome].every(isValidNumber)) {
    throw new Error("Income must be a valid number.");
  }
};
