import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * 
 * @returns {Promise} - Promise resolving to the rsposn
 */
export const getStudentsResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/me`);
    return response.data;
}

