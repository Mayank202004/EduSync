import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;


/**
 * @desc Function to fetch attendance dashboard data
 * @param {String} className - Class Name of which attendance data is to be fetched
 * @param {String} div - Class division of which attendance data is to be fetched
 * @returns {Promise<Object>} - Promise resolving to the attendance dashboard data
 */
export const getAttendanceDashboardData = async (className,div) => {
    const response = await axiosInstance.get(`${BASEURL}/attendence/dashboard`,{className,div});
    return response.data;
}