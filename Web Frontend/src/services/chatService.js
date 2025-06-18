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
