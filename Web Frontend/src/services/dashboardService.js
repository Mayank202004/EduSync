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

// = = = = = Verify Students API calls

/**
 * @desc Fetch unverified Students 
 * @returns {Promise<Object>} - promise resolving to list of unverified students
 */
export const fetchUnverifiedStudents = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/student/unverified`);
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

// = = = = = Verify Teachers API calls

/**
 * @desc Fetch unverified Teachers
 * @returns {Promise<Object>} - promise resolving to list of unverified teachers
 */
export const fetchUnverifiedTeachers = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/teacher/unverified`);
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

// = = = = = Manage Classes API calls

/**
 * @desc Fetch all classes
 * @returns {Promise<Object>} - promise resolving to list of classes
 */
export const fetchAllClasses = async () => {
    const response = await axiosInstance.get(`${BASEURL}/class/`);
    return response.data;
}

/**
 * @desc Add a new class
 * @param {String} className - Class NAme
 * @returns {Promise} - promise resolving to success message
 */
export const addClass = async (className) => {
    const response = await axiosInstance.post(`${BASEURL}/class/add`, {className});
    return response.data;
}

/**
 * @desc Add a new division
 * @param {String} className - Class Name
 * @param {String} div - Division 
 * @returns {Promise} - promise resolving to success message
 */
export const addDivision = async (className, div) => {
    const response = await axiosInstance.post(`${BASEURL}/class/add-div`, {className, div});
    return response.data;
}

/**
 * @desc Delete a class
 * @param {String} className - Class Name
 * @returns {Promise} - promise resolving to success message
 */
export const deleteClass = async (className) => {
    const response = await axiosInstance.delete(`${BASEURL}/class`,{data:{className}});
    return response.data;
}

/**
 * @desc Delete a division
 * @param {String} className - Class Name
 * @param {String} div - Division 
 * @returns {Promise} - promise resolving to success message
 */
export const deleteDivision = async (className, div) => {
    console.log(className, div);
    const response = await axiosInstance.delete(`${BASEURL}/class/div`,{data: { className, div }});
    return response.data;
}

// = = = = = Manage Teacher Subjects Api calls

export const fetchAllTeachers = async() => {
    const response = await axiosInstance.get(`${BASEURL}/teacher/all`);
    return response.data;
}

export const updateTeacherSubjects = async (Id,position,subjects,classTeacher,classCoordinator) => {
    const response = await axiosInstance.put(`${BASEURL}/teacher/details`,{Id,subjects,position,classTeacher,classCoordinator});
    return response.data;
}