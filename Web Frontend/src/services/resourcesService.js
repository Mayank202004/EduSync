import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * @desc Fetch resources for a student
 * @returns {Promise<Object>} - Promise resolving to the list of subjects and their resources
 */
export const getStudentsResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/me`);
    return response.data;
}

// To Do
export const getTeachersResources = async () =>{
    return;
}

/**
 * @desc Fetch all resources for admin
 * @returns {Promise<Object>} Promise resolving to the list of classes with subjects and resources
 */
export const getAdminResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/classes`);
    return response.data;
}
/**
 * @desc Create a new Class
 * @param {String} className - The name of class to be created
 * @returns {Promise<Object>} - Promise resolving to the created class data
 */
export const addClass = async (className) => {
    const response = await axiosInstance.post(`${BASEURL}/resource/add-class`, {className});
    return response.data;
}

/**
 * @desc Create a new Subject
 * @param {String} className - Class name to which the subject will be added 
 * @param {String} subjectName - Name of the subject to be added
 * @returns {Promise<Object>} - Promise resolving to the updated class data
 */
export const addSubject = async (className, subjectName) => {
    const response = await axiosInstance.post(`${BASEURL}/resource/add-subject`, {className,subjectName});
    return response.data;
}

/**
 * @desc Add a new chapter to a subject
 * @param {String} className - Class name to which the chapter wil be added
 * @param {String} subjectName - Subject name to which the chapter will be added
 * @param {String} termNumber - Term number to which the chapter will be added
 * @param {String} chapterName - Name of the chapter to be added
 * @returns {Promise<Object>} - Promise resolving to the updated class data
 */
export const addChapter = async (className, subjectName, termNumber, chapterName) =>{
    console.log('Adding chapter');
    const response = await axiosInstance.post(`${BASEURL}/resource/add-chapter`, {className, subjectName, termNumber, chapterName});
    return response.data;
}

