import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * @ Fetch messages for a given chat
 * @param {String} chatId - Chat Room Id
 * @returns {Promise<Object>} - Promise resolving to the list of messages 
 */
export const getChatMessages = async (chatId) => {
    const response = await axiosInstance.get(`${BASEURL}/chat/${chatId}`);
    return response.data;
}


/**
 * @desc Upload files and get URL
 * @param {Files} files - Files to upload
 * @returns {Promise<Object>} - Promise resolving to the list of URLs of uploaded files and their data
 */
export const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append("files", file);
    });

    const response = await axiosInstance.post(`${BASEURL}/chat/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // increase timeout for large files
    });

    return response.data?.data ?? [];
};
