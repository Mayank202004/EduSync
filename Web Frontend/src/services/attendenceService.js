import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;


/**
 * @desc Function to fetch attendance dashboard data
 * @param {String} className - Class Name of which attendance data is to be fetched
 * @param {String} div - Class division of which attendance data is to be fetched
 * @returns {Promise<Object>} - Promise resolving to the attendance dashboard data
 */
export const getAttendanceDashboardData = async (className,div) => {
    const response = await axiosInstance.post(`${BASEURL}/attendence/dashboard`,{className,div});
    return response.data;
}

/**
 * @desc Function to fetch attendance summary for a specific date
 * @param {String} className - Class name  
 * @param {String} div - Division
 * @param {Date} date - Date to fetch attendance
 * @returns {Promise<Object>} - Promis resolving to attendance summary of given date
 */
export const getAttendanceByDate = async (className,div,date) =>{
    const response = await axiosInstance.post(`${BASEURL}/attendence/daily`,{date,className,div});
    return response.data;
}

/**
 * @desc Function to fetch students list for given className and div
 * @param {String} className - Class name for which list to fetch
 * @param {String} div - Division for which student list to fetch
 * @returns {Promise<Object>} - Promise resolving to the list of students
 */
export const getStudentList = async (className, div) => {
    const response = await axiosInstance.post(`${BASEURL}/attendence/students`,{className,div});
    return response.data;
}

/**
 * @desc Mark attendance
 * @param {Array<String>} absentStudents - Array of _id (Student Id) of absent students
 * @param {Array<String>} permittedLeaveStudents - Array of _id (Student Id) of students who have permitted leave
 * @param {Date} date - Date for which attendance to mark
 * @returns {Promise} promise resolving to mark attendance status
 */
export const markAttendance = async (absentStudents,permittedLeaveStudents, date) => {
    const response = await axiosInstance.post(`${BASEURL}/attendence/mark`,{date,absentStudents,permittedLeaveStudents});
    return response.data;
}