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
 * @desc Function to verify OTP
 * @param {String} otp - OTP
 * @param {String} tempToken - Temp token
 * @returns {Promise<Object>} - Promise resolving to the response data
 */
export const verifyOtpApi = async (otp, tempToken) => {
  const response = await axiosInstance.post("/users/verify-otp", { otp }, {
    headers: { "x-temp-token": tempToken }
  });
  return response.data;
};

/**
 * @desc Function to resend OTP
 * @param {String} email - Email
 * @param {String} tempToken - Temp token
 * @returns {Promise} - Promise resolving to the resend success message
 */
export const resendOtpApi = async (email, tempToken) => {
  const response = await axiosInstance.post("/users/resend-otp", { email },{
    headers: { "x-temp-token": tempToken }
  });
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
