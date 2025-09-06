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
 * @desc Funcion to fetch top level admin dashboard data
 * @returns {Promise<Object>} - Promise rsolving to the top level dashboard data
 */
export const getTopLevelDashboardData = async () =>{
  const response = await axiosInstance.get(`${BASEURL}/attendence/admin-dashboard`);
  return response.data;
}

/**
 * @desc Funcion to fetch class level admin dashboard data
 * @returns {Promise<Object>} - Promise rsolving to the class level dashboard data
 */
export const getClassLevelDashboardData = async (className) =>{
  const response = await axiosInstance.get(`${BASEURL}/attendence/admin-class-dashboard/${className}`);
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
 * @desc Function to fetch all classes and divisions 
 * @returns {Promise<Object>} - Promise resolving to the list of classes and divisions
 */
export const getAllClasses = async () => {
    const response = await axiosInstance.get(`${BASEURL}/class/`);
    return response.data;
}

/**
 * @desc Mark attendance
 * @param {Array<String>} absentStudents - Array of _id (Student Id) of absent students
 * @param {Array<String>} permittedLeaveStudents - Array of _id (Student Id) of students who have permitted leave
 * @param {Date} date - Date for which attendance to mark
 * @returns {Promise} promise resolving to mark attendance status
 */
export const markAttendance = async (className,div,absentStudents,permittedLeaveStudents, date) => {
    const response = await axiosInstance.post(`${BASEURL}/attendence/mark`,{className,div,date,absentStudents,permittedLeaveStudents});
    return response.data;
}

/**
 * @desc Exports excel for attendance
 * Default : Returns yearly (If month and year provided then provides for a specific month)
 * @param {String} month - Month for which attendance to export 
 * @param {String} year  - Month for which attendance to export
 * @returns {Promise} - Promise resolving to xlsx for attendance
 */
export const exportAttendance = async (className, div, month = "", year = "") => {
  const payload = month && year ? { className, div, month, year } : { className, div };

  const response = await axiosInstance.post(
    `${BASEURL}/attendence/export`,
    payload,
    {
      responseType: 'blob', //Receive binary data
    }
  );

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank'; // Attempt to open in new tab (Might not work in some browsers (will start direct download))
  a.download = `Attendance_${className || 'Class'}_${div || 'Div'}_${month || 'All'}_${year || 'All'}.xlsx`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  a.remove();
  window.URL.revokeObjectURL(url);
};
