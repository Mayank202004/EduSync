const FULLNAME_REGEX: RegExp = /^[a-zA-Z\s]+$/;
const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean =>
  typeof email === "string" && EMAIL_REGEX.test(email);

export const isValidName = (name: string): boolean => FULLNAME_REGEX.test(name);

export const isNonEmptyString = (value: any): boolean =>
  typeof value === "string" && value.trim().length > 0;

export const isBoolean = (value: any): boolean => typeof value === "boolean";

export const isValidNumber = (value: any): boolean =>
  typeof value === "number" && !isNaN(value) && isFinite(value);

export function capitalizeFirstLetter(input: String) {
  return `${input.at(0).toUpperCase()}${input.slice(1)}`
}

export function maskEmail(email) {
  const [name, domain] = email.split("@");
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
}