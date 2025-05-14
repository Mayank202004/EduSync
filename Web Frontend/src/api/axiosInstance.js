import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BASEURL, 
  withCredentials: true, 
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
axiosInstance.interceptors.response.use(
  (response) => response, // If request is successful, return the response
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to token expiry (401 Unauthorized), try refreshing the token
    const isRefreshUrl = originalRequest.url?.includes('/users/refresh-token');
    if (
      error.response?.status === 401 && !originalRequest._retry && !isRefreshUrl) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosInstance.post("/users/refresh-token",{},{ withCredentials: true });

        if (refreshResponse.status === 200) {
          return axiosInstance(originalRequest); // Retry original request
        } else {
          console.error("Token refresh failed with status:", refreshResponse.status);
          //window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        //window.location.href = '/login'; // Hard stop to break retry cycle
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
