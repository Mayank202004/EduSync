import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * @desc Fetch resources for a student
 * @returns {Promise} - Promise resolving to the rsposn
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
 * @returns { Promise } - Promise resolving to the response
 */
export const getAdminResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/classes`);
    return response.data;
}

