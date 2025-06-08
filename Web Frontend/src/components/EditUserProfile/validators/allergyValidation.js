import { isNonEmptyString } from "@/lib/textUtils";

export const validateAllergy = (values) => {
  const { allergy } = values;
  const errors = new Map();

  if (!isNonEmptyString(allergy)) {
    errors.set("allergy", "Allergy should not be empty");
  }

  return errors;
};
