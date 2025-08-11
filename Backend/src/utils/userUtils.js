import crypto from "crypto";
import { User } from "../models/user.model.js";

/**
 * @desc  Helper to generate unique username
 * @param {String} fullName - Full name of the user
 * @returns {String} - Unique username
 */
export const generateUniqueUsername = (fullName, existingUsernames) => {
    let baseUsername = fullName.split(" ")[0].toLowerCase();
    let username = baseUsername;
    let counter = 1;

    while (existingUsernames.has(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
    }

    existingUsernames.add(username);
    return username;
};


/**
 * @desc Helper to generate random password
 * @returns {String} - Random password
 */
export const generateRandomPassword = () => {
    return crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
};

/**
 * @desc Helper to send credentials over mail
 * @param {String} email - Email of the user
 * @param {Object<username,password>} credentials - Newly generated credentials
 * @returns 
 */
export const sendCredentialOverMail = (email, credentials) => {
    return Promise.resolve();
};
