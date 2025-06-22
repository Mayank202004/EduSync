import {
  isNonEmptyString,
  isValidNumber,
} from "@/utils/textUtils";

export const validateNewFee = (values) => {
  const {
    title,
    amount,
    dueDate,
    feeType,
    discount,
    className,
    addToAll,
  } = values;

  const errors = new Map();

  // Title
  if (!isNonEmptyString(title)) {
    errors.set("title", "Title is required.");
  }

  // Amount
  if (!isValidNumber(amount) || amount <= 0) {
    errors.set("amount", "Enter a valid positive amount.");
  }

  // Due Date
  if (!isNonEmptyString(dueDate)) {
    errors.set("dueDate", "Due date is required.");
  }

  // Fee Type
  if (!isNonEmptyString(feeType)) {
    errors.set("feeType", "Fee type is required.");
  }

  // Discount (optional but must be valid if provided)
  if (discount) {
    if (!isValidNumber(discount) || discount < 0 || discount > 100) {
      errors.set("discount", "Discount must be a number between 0 and 100.");
    }
  }

  // Class Name (required if addToAll is false)
  if (!addToAll && !isNonEmptyString(className)) {
    errors.set("className", "Class name is required if 'Add to all' is not checked.");
  }

  return errors;
};
