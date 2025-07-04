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

// To DO : check this (by/For mayank)
export const updateFeeStructure = async (data) => {
  console.log("Mock updateFeeStructure called with:", data);
  return { success: true };
};

/**
 * @desc Function to export/print paid fee receipt
 * @param {Object} - transactionId, feeId, feeType, title, receiptNo
 * @returns {Promise} Promise resolving to success message
 */
export const exportFee = async (transactionId, feeId, feeType, title, receiptNo) => {
  try {
    const response = await axiosInstance.post(
      `/fee/receipt`,
      {
        transactionId,
        feeId,
        feeType,
        title,
        receiptNo,
      },
      {
        responseType: "text", // This is HTML
      }
    );

    const blob = new Blob([response.data], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${receiptNo}.html`; // Or `.pdf` if your backend returns PDF
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl); // Cleanup

  } catch (err) {
    console.error("Failed to download receipt:", err);
    alert("Could not download the receipt. Please try again.");
  }
};


