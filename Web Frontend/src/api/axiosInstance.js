import axios from 'axios';

// Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, 
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
  (response) => response,  // If request is successful, return the response
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to token expiry (401 Unauthorized), try refreshing the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token using the refresh token
        const refreshResponse = await axios.post('/refresh-token', {}, { withCredentials: true });  // Modify endpoint as needed
        // No need to manually set the new access token, since the backend will automatically set it in cookies
        
        // Retry the original request with the new token (no need to manually add the token)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login page or show an error message
        console.error('Token refresh failed', refreshError);
        window.location.href = '/login';  // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
