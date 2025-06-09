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
 * @param {object} data - User's data to be sent to API
 * @param {string} data.fullName - User's full name
 * @param {string} data.username - User's username
 * @param {string} data.email - User's email address
 * @param {string} data.password - User's password
 * @param {string} data.role - User's role
 * @returns {Promise<any>} - Promise resolving to the response data
 */
export const signupApi = async (data) => {
  const response = await axiosInstance.post(`/users/register`, data);
  return response.data;
};
