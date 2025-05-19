import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * 
 * @desc Function to get student's fees info
 * @returns {Promise} - Promise resolving to the response data
 */

export const getUserFees = async () => {
    const response = await axiosInstance.get(`${BASEURL}/fee/myfees`);
    return response.data;
}