import axiosInstance from "@/api/axiosInstance";

/**
 * @desc Function to log user out
 * @returns nothing. Just clears tokens from cookies
 */
export const logoutApi = async () => {
  return axiosInstance.post("/users/logout");
};

/**
 *
 * @param {string} identifier - User's email address or username
 * @param {string} password - User's password
 * @returns {Promise} - Promise ressolving to the response data
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const loginApi = async (identifier, password) => {
  const body = EMAIL_REGEX.test(identifier)
    ? { email: identifier, password } // send as “email”
    : { username: identifier, password }; // send as “username”

  const { data } = await axiosInstance.post("/users/login", body);

  return data;
};

/**
 * @desc Function to handle user signup
 * @param {string} fullname - User's full name
 * @param {string} usersname - User's username
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} role - Users role
 * @returns {Promise} - Promise resolving to the repsosne data
 *
 */
export const signupApi = async (fullName, username, email, password, role) => {
  const response = await axiosInstance.post(`/users/register`, {
    fullName,
    username,
    email,
    password,
    role,
  });
  return response.data;
};
