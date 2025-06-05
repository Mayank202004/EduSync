import axiosInstance from "@/api/axiosInstance";

/**
 *
 * @desc Function to get student's fees info
 * @returns {Promise} - Promise resolving to the response data
 * @throws Will throw an error if the update fails.
 */
export const getUserFees = async () => {
  const response = await axiosInstance.get("/fee/myfees");
  return response.data;
};
