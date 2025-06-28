import axiosInstance from "@/api/axiosInstance";

/**
 * Fetches the logged-in student's information.
 *
 * @returns {Promise<Object>} The student's data.
 * @throws Will throw an error if the request fails.
 */
export const getStudentInfo = async () => {
  const response = await axiosInstance.get("/student/me");
  return response.data;
};

/**
 * Submits sibling information for the current student.
 *
 * @param {Object} data - The sibling data to be submitted.
 * @param {string} data.name - Name of the sibling.
 * @param {string} data.relation - Relationship to the student.
 * @param {number} data.age - Age of the sibling.
 * @param {boolean} data.isInSameSchool - Whether the sibling studies in the same school.
 * @param {string} [data.class] - Class (if in the same school).
 * @param {string} [data.div] - Division (if in the same school).
 * @returns {Promise<Object>} The saved sibling data.
 * @throws Will throw an error if the request fails.
 */
export const addSiblingInfoApi = async (data) => {
  const response = await axiosInstance.post("/student/sibling-details", data);
  return response.data;
};

/**
 * Submits parent information (name, occupation, income) for the student.
 *
 * @param {Object} data - The parent details.
 * @param {string} data.fatherName - Father's full name.
 * @param {string} data.fatherOccupation - Father's occupation.
 * @param {number} data.fatherIncome - Father's income.
 * @param {string} data.motherName - Mother's full name.
 * @param {string} data.motherOccupation - Mother's occupation.
 * @param {number} data.motherIncome - Mother's income.
 * @returns {Promise<Object>} The saved parent details.
 * @throws Will throw an error if the request fails.
 */
export const addParentDetailsApi = async (data) => {
  const response = await axiosInstance.post("/student/parent-details", data);
  return response.data;
};

/**
 * Submits parent contact details for the student.
 *
 * @param {Object} data - The parent contact information.
 * @param {string} data.name - Parent's name.
 * @param {string} data.relation - Relationship to the student.
 * @param {string} data.phone - Parent's phone number.
 * @returns {Promise<Object>} The saved parent contact record.
 * @throws Will throw an error if the request fails.
 */
export const addParentContactApi = async (data) => {
  const response = await axiosInstance.post("/student/parent-contact", data);
  return response.data;
};

/**
 * Submits allergy details for the student.
 *
 * @param {String} data - The allergy information.
 * @param {string} data.allergy - Name of the allergy.
 * @returns {Promise<Object>} The saved allergy record.
 * @throws Will throw an error if the request fails.
 */
export const addAllergyApi = async (data) => {
  const response = await axiosInstance.post("/student/allergy", data);
  return response.data;
};

export const deleteSiblingApi = async (siblingId) => {
  const response = await axiosInstance.delete(`/student/sibling-details/${siblingId}`);

  return response.data;
};
