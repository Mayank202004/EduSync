const FULLNAME_REGEX: RegExp = /^[a-zA-Z\s]+$/;

export const isValidName = (name: string): boolean => FULLNAME_REGEX.test(name);

export const isNonEmptyString = (value: any): boolean =>
  typeof value === "string" && value.trim().length > 0;

export const isBoolean = (value: any): boolean => typeof value === "boolean";

export const isValidNumber = (value: any): boolean =>
  typeof value === "number" && !isNaN(value) && isFinite(value);
