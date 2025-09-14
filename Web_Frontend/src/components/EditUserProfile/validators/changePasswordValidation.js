import { isNonEmptyString } from "@/utils/textUtils";

export const validateChangePassword = (values) => {
    const {oldPassword, newPassword, confirmPassword} = values;
    const errors = new Map();

    if (!isNonEmptyString(oldPassword)) errors.set("oldPassword", "Old password cannot be empty.");
    if (!isNonEmptyString(newPassword)) errors.set("newPasword", "New password cannot be empty.");
    if (newPassword !== confirmPassword) errors.set("confirmPassword", "Does not match new password.");

    return errors;
}