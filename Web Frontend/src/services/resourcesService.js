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

/**
 * @desc Fetch resources for a student
 * @returns {Promise<Object>} - Promise resolving to the list of classes their subjects and their resources
 */
export const getTeacherResources = async () =>{
    const response = await axiosInstance.get(`${BASEURL}/resource/teacher`);
    return response.data;
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

/**
 * @desc Add resource/s to a chapter
 * @param {String} className 
 * @param {String} subjectName 
 * @param {String} termNumber 
 * @param {String} chapterName 
 * @param {Files} files 
 * @returns {Promise<Object>} - Promise resolving to the updated class data
 */
export const addResource = async (className, subjectName, termNumber, chapterName, files) => {
  const formData = new FormData();
  formData.append('className', className);
  formData.append('subjectName', subjectName);
  formData.append('termNumber', termNumber);
  formData.append('chapterName', chapterName);
  // Append all files with field name "files"
  files.forEach(file => formData.append('files', file));

  const response = await axiosInstance.post(`${BASEURL}/resource/add-resource`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  },{timeout:1000});
  return response.data;
};

/**
 * @desc Delete resource
 * @returns {Promise}  - Promise resolving to success message
 */
export const deleteResource = async(className,subjectName,termNumber,chapterName,resourceUrl) =>{
  const response = await axiosInstance.delete(`${BASEURL}/resource/delete-resource`,{data:{className,subjectName,termNumber,chapterName,resourceUrl}},{timeout:1000});
  return response.data;
}
