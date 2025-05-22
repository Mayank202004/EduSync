import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * @desc Fetch resources for a student
 * @returns {Promise<Object>} - Promise resolving to the list of subjects and their resources
 */
export const getStudentsResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/me`);
    return response.data;
}

// To Do
export const getTeachersResources = async () =>{
    return;
}

/**
 * @desc Fetch all resources for admin
 * @returns {Promise<Object>} Promise resolving to the list of classes with subjects and resources
 */
export const getAdminResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/classes`);
    return response.data;
}
/**
 * @desc Create a new Class
 * @param {String} className - The name of class to be created
 * @returns {Promise} - Promise resolving to the response
 */
export const addClass = async (className) => {
    const response = await axiosInstance.post(`${BASEURL}/resource/add-class`, {className});
    return response.data;
}

