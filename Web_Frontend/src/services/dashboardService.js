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

// = = = = = Manage Academic Year Api calls

/**
 * @desc Fetch Manage acdemic year data
 * @returns {Promise<Object<String<Academic Year>, Object<classesAndDiv>, Object<Students>>>}
 */
export const fetchManageAcademicYearData = async () => {
    const response = await axiosInstance.get(`${BASEURL}/dashboard/academic-year`);
    return response.data;
}

/**
 * @desc Update academic year
 * @param {String} newYear 
 * @returns {Promise} - promise resolving to success message
 */
export const updateAcademicYear = async (newYear) => {
    await axiosInstance.put(`${BASEURL}/setting/academic-year`,{academicYear:newYear});
}

/**
 * @desc Promote all students to next class and unverify pass-outs
 * @returns {Promise} - promise resolving to success message
 */
export const promoteStudents = async () => {
    await axiosInstance.patch(`${BASEURL}/student/promote`);
};

/**
 * @desc Shuffle all student's division's
 * @returns {Promise} - promise resolving to success message
 */
export const shuffleDivisions = async () => {
    await axiosInstance.patch(`${BASEURL}/student/shuffle`);
};

/**
 * @desc Manually assign all students their division
 */
export const assignStudentDivisions = async (className, assignments) => {
    await axiosInstance.patch(`${BASEURL}/student/assign-divisions`, {className,assignments});
};

/**
 * @desc Clear old data
 * @returns {Promise} - promise resolving to success message
 */
export const clearOldData = async (attendance=false,feeStatus=false,messages=false,tickets=false) => {
    await axiosInstance.post(`${BASEURL}/dashboard/cleanup`,{attendance,feeStatus,messages,tickets});
};

/**
 * @desc Fetch open tickets
 * @returns {Promise<Object>} - promise resolving to list of open tickets
 */
export const fetchOpenTickets = async () => {
    const response = await axiosInstance.get(`${BASEURL}/ticket/open`);
    return response.data;
}


// = = = = = Manage Users Api calls

export const bulkStudentUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file); 

  const response = await axiosInstance.post(
    `${BASEURL}/users/bulk-register-students`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const registerStudentBySuperAdmin = async (formData) => {
  const response = await axiosInstance.post(`${BASEURL}/users/register-student`, formData);
  return response.data;
}
