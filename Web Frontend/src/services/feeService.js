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

/**
 * @desc Function to get All fee structure for super admin
 * @returns {Promise} Promise resolving to list of fee structures
 */
export const getAllFees = async () => {
  const response = await axiosInstance.get("/feestructure/all")
  return response.data;
}

/**
 * @desc Function to add new fee structure
 * @param {Object} - data {className, amount, title, feeType, dueDate, compulasory, discount, addToAllClasses} 
 * @returns {Promise} Promise resolving to success message
 */
export const addFeeStructure = async (data) => {
  const response = await axiosInstance.post("/feestructure/add", data);
  return response.data;
}
