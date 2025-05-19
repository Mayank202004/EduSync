import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * 
 * @returns {Promise} - Promise resolving to the rsposn
 */
export const getCalendarEvents = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/calendar/events`);
    return response.data;
}

