/**
 * @desc  Helper to generate unique username
 * @param {String} fullName - Full name of the user
 * @returns {String} - Unique username
 */
export const generateUniqueUsername = async (fullName) => {
    let baseUsername = fullName.split(" ")[0].toLowerCase();
    let username = baseUsername;
    let counter = 1;

    while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
    }
    return username;
};

/**
 * @desc Helper to generate random password
 * @returns {String} - Random password
 */
export const generateRandomPassword = () => {
    return crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
};

export const sendCredentialOverMail = (email,credencials) => {
    return;
}