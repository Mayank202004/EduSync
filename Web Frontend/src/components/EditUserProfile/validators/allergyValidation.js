import { isNonEmptyString } from "@/lib/textUtils";

export const validateAllergy = (values) => {
  const { allergy } = values;
  if (!isNonEmptyString(allergy)) {
    throw new Error("Allergy should not be empty.");
  }

  return true;
};
