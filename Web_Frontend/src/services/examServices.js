import axiosInstance from "@/api/axiosInstance";

export const getAllFaqs = async () => {
  const response = await axiosInstance.get("/faq/category/fee");
  return response.data;
};

/**
 * @desc Add/Create new Exam
 * @param {String} examName 
 * @returns {Promise} Promise resolving to success message
 */
export const addExam = async (examName) => {
    const response = await axiosInstance.post("/exams/add",{examName});
    return response.data;
}

/**
 * @desc Delete an Exam
 * @param {String} examId _id of Exam 
 * @returns {Promise} Promise resolving to success message
 */
export const deleteExam = async (examId) => {
    const response = await axiosInstance.delete(`/exams/${examId}`);
    return response.data;
}