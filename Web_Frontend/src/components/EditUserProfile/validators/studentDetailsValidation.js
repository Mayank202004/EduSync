import { isNonEmptyString } from "@/utils/textUtils";

const isVaildBloodGroup = (value) =>
  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(value);

export const validateStudentDetails = (data) => {
  const { bloodGroup, dob, address } = data;
  const errors = new Map();

  if (![bloodGroup, dob, address].some(isNonEmptyString)) {
    throw new Error("Atleast one of the fields should be filled");
  }

  if (bloodGroup && !isVaildBloodGroup(bloodGroup)) {
    throw new Error("Invalid blood group");
  }

  if (dob && isNaN(Date.parse(dob))) {
    throw new Error("Invalid date of birth");
  }

  if (address && !isNonEmptyString(address)) {
    errors.set("address", "Address is invalid!");
  }

  return errors;
};
