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
 * @desc Update already existing marks of a class
 * @param {String} examId _id of Exam selected
 * @param {String} subject Subject Name
 * @param {String} className Class Name
 * @param {String} div Division
 * @param {Object} marks {_id,marks} 
 * @param {String} totalMarks Maximum atainable marks of the exam 
 * @returns {Promise} - Promise resolving to count of success and failed mark entries
 */
export const updateClassMarks = async (examId,subject,className,div,marks,totalMarks) => {
  const response = await axiosInstance.put(
    "/marks/update-class-marks", 
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

/**
 * @desc Fetch marks data of a class for a particular exam
 * @param {String} className - Class Name
 * @param {String} div - Division
 * @param {String} examId - _id of Exam
 * @returns {Promise<Object>} - {marks,subjectName} Object of marks data along with list of subjects
 */
export const getClassMarksData = async (className,div,examId) => {
  const response = await axiosInstance.post("/marks/class-marks-data",{className,div,examId});
  return response.data;
}

/**
 * @desc Fetch Initial data for super admin marks tab
 * @returns {Promise<Object>} - Promise resolving to super admin data
 */
export const getSuperAdminData = async () => {
  const response = await axiosInstance.get("/marks/superadmin-data");
  return response.data;
}

/**
 * @desc Fetch Student Marks data
 * @returns {Promise<Object>} - Promise resolving to marks data
 */
export const getStudentMarksData = async () => {
  const response = await axiosInstance.get('/marks/student-data');
  return response.data;
}

/**
 * @desc Publish Exam Result (So that students can see)
 * @param {String} examId _id of Exam
 * @param {String} className Class Name
 * @param {String} div Division
 * @returns 
 */
export const togglePublishExamResult = async (examId,className,div) => {
  const response = await axiosInstance.post('/marks/toggle-publish-exam-result', {examId,className,div});
  return response.data;
}


/**
 * @desc Export marksheed for a particular exam for a particular student
 * @returns {Promise} Promise resolving to PDF download
 */
export const exportExamMarksheet = async (examId) => {
  const response = await axiosInstance.post(
    "/marks/render-exam-marksheet",
    { examId },
    { 
      responseType: "blob",
      timeout: 10000,
     }
  );

  // Convert blob to PDF object
  const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Auto-download
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = `marksheet.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Preview in new tab (instead of download)
  window.open(pdfUrl, "_blank");
};



