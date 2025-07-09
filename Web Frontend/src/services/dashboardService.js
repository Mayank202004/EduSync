import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * @desc Fetches student dashboard data from the API
 * @returns {Promise} - Promise resolving to  the dashboard data
 */
export const fetchStudentDashboardData = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/dashboard/student`);
    return response.data;
}


/**
 * @desc Fetches teacher dashboard data from the API
 * @returns {Promise} - Promise resolving to  the dashboard data
 */
export const fetchTeacherDashboardData = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/dashboard/teacher`);
    return response.data;
}

/**
 * @desc Fetches super admin dashboard data from the API
 * @returns {Promise} - Promise resolving to  the dashboard data
 */
export const fetchSuperAdminDashboardData = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/dashboard/super-admin`);
    return response.data;
}


/**
 * @desc Fetch unverified Students 
 * @returns {Promise<Object>} - promise resolving to list of unverified students
 */
export const fetchUnverifiedStudents = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/student/unverified`);
    return response.data;
}

/**
 * @desc Fetch unverified Teachers
 * @returns {Promise<Object>} - promise resolving to list of unverified teachers
 */
export const fetchUnverifiedTeachers = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/teacher/unverified`);
    return response.data;
}

/**
 * @desc Verify Student
 * @param {String} studId - _id of student
 * @param {String} className - Class name of student
 * @param {String} div - Division of student
 * @returns {Promise} - promise resolving to success message
 */
export const verifyStudent = async (studId,className,div) => {
    const response = await axiosInstance.post(`${BASEURL}/student/class-details`, {studId,className,div});
    return response.data;
}

/**
 * @desc Verify Teacher
 * @param {String} teacherId - _id of teacher
 * @returns {Promise} - promise resolving to success message 
 */
export const verifyTeacher = async (teacherId) => {
    const response = await axiosInstance.patch(`${BASEURL}/teacher/verify/${teacherId}`);
    return;
}