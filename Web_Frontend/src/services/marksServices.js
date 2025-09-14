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
 * @desc Function to get mark list template for a given class and div
 * @param {String} className - Class Name
 * @param {String} div - Division
 * @return {Promise} Promise resolving to template pdf
 */
export const getMarkListTemplate = async (className,div) => {
    const response = await axiosInstance.post(
        "/marks/class-marklist-template",
        {className,div},
        {
            responseType:"blob", 
            timeout:10000
        }
    );
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Auto-download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `markList-${className}-${div}-template.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Preview in new tab (instead of download)
    window.open(pdfUrl, "_blank");
}

/**
 * @desc Function to add marks of stdents for a given class and div
 * @param {String} examId _id of Exam selected
 * @param {String} subject Subject Name
 * @param {String} className Class Name
 * @param {String} div Division
 * @param {Object} marks {_id,marks} 
 * @param {String} totalMarks Maximum atainable marks of the exam 
 * @returns {Promise} - Promise resolving to count of success and failed mark entries
 */
export const addClassMarks = async (examId,subject,className,div,marks,totalMarks) => {
  const response = await axiosInstance.post(
    "/marks/add-class-marks", 
    {examId,subject,className,div,students:marks,totalMarks},
    {timeout: 10000});
  return response.data;
};

/**
 * @desc Fetch initial data for teacher marks tab
 * @returns {Promise{Object}} Promise resolving to exams and Previous Marking Data
 */
export const getTeacherMarksData = async () => {
  const response = await axiosInstance.get("/marks/teacher-data");
  return response.data;
}