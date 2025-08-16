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
 * @desc Function to pay fee
 * @param {Object} data - {feeType, studentId, fees<structureId,amount>, transactionId, mode} 
 * @returns {Promise} - Promise resolving to success message
 */
export const payFee = async (data) => {
  const response = await axiosInstance.post("/fee/pay", data);
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

// To DO : check this (by/For mayank)
export const updateFeeStructure = async (data) => {
  return { success: true };
};

/**
 * @desc Function to export/print paid fee receipt
 * @param {Object} - transactionId, feeId, feeType, title, receiptNo
 * @returns {Promise} Promise resolving to success message
 */
export const exportFee = async (transactionId, feeId, feeType, title, receiptNo) => {
  const response = await axiosInstance.post(
    "/fee/receipt",
    { transactionId, feeId, feeType, title, receiptNo },
    { responseType: "blob" }
  );

  // Convert blob to PDF object
  const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Auto-download
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = `receipt-${receiptNo}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Preview in new tab (instead of download)
  window.open(pdfUrl, "_blank");
};



