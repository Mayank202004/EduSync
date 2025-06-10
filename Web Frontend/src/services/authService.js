import axiosInstance from "@/api/axiosInstance";
import { isValidEmail } from "@/utils/textUtils";

/**
 * @desc Function to log user out
 * @returns nothing. Just clears tokens from cookies
 */
export const logoutApi = async () => {
  return axiosInstance.post("/users/logout");
};

/**
 * @desc Logs in a user using username or email and password.
 * @param {object} data - User's data to be sent to API
 * @param {string} data.identifier - User's email address or username
 * @param {string} data.password - User's password
 * @returns {Promise} - Promise resolving to the response data
 */
export const loginApi = async (data) => {
  const {identifier, password} = data
  const body = isValidEmail(identifier)
    ? { email: identifier, password }
    : { username: identifier, password };

  const response = await axiosInstance.post("/users/login", body);
  return response.data;
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
