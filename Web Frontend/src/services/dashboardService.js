import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * @desc Fetches the dashboard data from the API
 * @returns {Promise} - Promise resolving to  the dashboard data
 */
export const fetchStudentDashboardData = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/dashboard/student`);
    return response.data;
}