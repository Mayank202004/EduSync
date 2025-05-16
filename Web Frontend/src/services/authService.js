
import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

/**
 * 
 * @param {string} email - User's email address 
 * @param {string} password - User's password
 * @returns {Promise} - Promise ressolving to the response data
 */
export const loginApi = async (email, password) => {
  
  const response = await axiosInstance.post(`${BASEURL}/users/login`,
    {
    username : email,
    password,
    },
    {
      headers:{
        'content-type': 'application/json',
      },
    },
    
  );
  return response.data;
};

/**
 * @desc Function to handle user signup
 * @param {string} fullname - User's full name
 * @param {string} usersname - User's username
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} role - Users role
 * @returns {Promise} - Promise resolving to the repsosne data
 * 
 */
export const signupApi = async (fullName, username, email, password, role) =>{
  const response = await axiosInstance.post(`/users/register`,{
    fullName,
    username,
    email,
    password,
    role
  });
  return response.data;
}
