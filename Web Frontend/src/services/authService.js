
import axiosInstance from '@/api/axiosInstance';

const BASEURL = import.meta.env.VITE_API_BASE_URL;

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
